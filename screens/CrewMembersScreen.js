import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import fetchService from "../services/FetchService";

const CrewMembersScreen = ({ navigation, route }) => {
  // 1. Receive params from MyCrewsScreen
  const { crewId, crewName } = route.params;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

const fetchMembers = async () => {
  try {
    setLoading(true);
    
    // PARAMETER NAME MUST MATCH SQL "p_crew_id"
    const { data, error } = await fetchService.callRPC('get_crew_members_list', { 
      p_crew_id: crewId 
    });

    if (error) throw error;
    setMembers(data || []);
    
  } catch (error) {
    console.error('Error fetching members:', error);
  }
  finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchMembers();
  }, [crewId]);

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberCard}>
      <View style={styles.avatarContainer}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {(item.name || item.email || '?').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.memberInfo}>
        {/* Fallback to email if name isn't in metadata */}
        <Text style={styles.memberName}>{item.name || item.email?.split('@')[0] || 'Member'}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
      
      {/* Visual indicator that they are in the crew */}
      <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View>
            <Text style={styles.headerTitle}>{crewName}</Text>
            <Text style={styles.headerSubtitle}>Crew Members</Text>
        </View>
      </View>

      {/* Main Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.member_id.toString()}
          renderItem={renderMemberItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="person-remove-outline" size={60} color="#666" />
              <Text style={styles.emptyText}>No members found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Assuming dark theme based on your previous code
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#111',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#222',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  memberEmail: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
  }
});

export default CrewMembersScreen;