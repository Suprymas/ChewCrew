import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from "../lib/supabase"; 
import { useAuth } from "../context/AuthContext"; 
import fetchService from "../services/FetchService";

const CrewMembersScreen = ({ navigation, route }) => {
  const { crewId, crewName } = route.params;
  const { user } = useAuth(); 
  const insets = useSafeAreaInsets();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crewOwnerId, setCrewOwnerId] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await fetchService.callRPC('get_crew_members_list', { 
        p_crew_id: crewId 
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setMembers(data);
        setCrewOwnerId(data[0].crew_creator_id);
      } else {
        setMembers([]);
      }
      
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [crewId]);

  // --- LEAVE / DELETE LOGIC ---
  const handleLeaveCrew = () => {
    const isLastMember = members.length === 1;

    Alert.alert(
      isLastMember ? "Delete Crew?" : "Leave Crew?",
      isLastMember 
        ? `You are the last member. "${crewName}" will be deleted permanently.`
        : `Are you sure you want to leave "${crewName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: isLastMember ? "Delete Crew" : "Leave", 
          style: 'destructive',
          onPress: async () => {
            try {
              // 1. Delete user from crew_members
              const { error } = await supabase
                .from('crew_members')
                .delete()
                .match({ crew: crewId, member: user.id });

              if (error) throw error;

              // 2. If last member, delete the crew row entirely
              if (isLastMember) {
                await supabase.from('crew').delete().eq('id', crewId);
              }

              // 3. Go back
              navigation.navigate('MyCrews'); 
            } catch (err) {
              Alert.alert("Error", "Failed to leave crew.");
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const handleKickMember = (memberId, memberName) => {
    Alert.alert(
      "Kick Member?",
      `Are you sure you want to kick ${memberName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Kick", 
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('crew_members')
                .delete()
                .match({ crew: crewId, member: memberId });
              
              if (error) throw error;
              fetchMembers(); // Refresh list
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const renderMemberItem = ({ item }) => {
    const isMe = item.member_id === user?.id;
    const isCrewOwner = item.member_id === crewOwnerId; 
    const iAmTheOwner = user?.id === crewOwnerId; 

    return (
      <View style={styles.memberCard}>
        <View style={styles.leftSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{item.icon || '👤'}</Text>
            </View>
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>
              {isMe ? "You" : item.display_name}
              {isCrewOwner && <Text style={{color: '#FFD700'}}> 👑</Text>}
            </Text>
            <Text style={styles.memberEmail}>{item.email}</Text>
          </View>
        </View>

        {/* OWNER KICK BUTTON (Only show if I am owner AND target is not me) */}
        {iAmTheOwner && !isMe && (
          <TouchableOpacity 
            onPress={() => handleKickMember(item.member_id, item.display_name)}
            style={styles.kickButton}
          >
            <Text style={styles.kickText}>Kick</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View>
            <Text style={styles.headerTitle}>{crewName}</Text>
            <Text style={styles.headerSubtitle}>{members.length} Members</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      ) : (
        <>
          <FlatList
            data={members}
            keyExtractor={(item) => item.member_id.toString()}
            renderItem={renderMemberItem}
            contentContainerStyle={styles.listContent}
          />
          
          {/* --- BIG LEAVE BUTTON AT BOTTOM --- */}
          <View style={[styles.footerContainer, { paddingBottom: insets.bottom + 10 }]}>
            <TouchableOpacity 
              style={styles.leaveButton}
              onPress={handleLeaveCrew}
            >
              <Text style={styles.leaveButtonText}>
                {members.length === 1 ? "Delete Crew" : "Leave Crew"}
              </Text>
              <Ionicons name="log-out-outline" size={20} color="#ff4444" style={{marginLeft: 8}}/>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderBottomWidth: 1, borderColor: '#333' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 14, color: '#999' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 100 }, // Extra padding for bottom button
  
  memberCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, marginBottom: 12, borderRadius: 12, backgroundColor: '#111', borderWidth: 1, borderColor: '#333' },
  leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 20 },
  memberInfo: { flex: 1 },
  memberName: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  memberEmail: { color: '#888', fontSize: 12 },

  kickButton: { backgroundColor: '#331111', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#550000' },
  kickText: { color: '#ff4444', fontSize: 12, fontWeight: '700' },

  // Footer Styles
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#220000',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#440000',
  },
  leaveButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '700',
  }
});

export default CrewMembersScreen;