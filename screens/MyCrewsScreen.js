import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import fetchService from "../services/FetchService";

const MyCrewsScreen = ({ navigation }) => {
  const [crews, setCrews] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const fetchCrews = async () => {
    try {
      setLoading(true);

      const { data, error } = await fetchService.callRPC('get_my_crews');
      if (error) throw error;
      setCrews(data || []);
      console.log(data)

    } catch (error) {
      console.error('Error fetching crews:', error);
      setCrews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrews();
  }, []);


  const handleCrewPress = (crew) => {
    console.log('Crew pressed:', crew.name);
  };

  const renderCrewItem = ({ item }) => (
    <TouchableOpacity
      style={styles.crewCard}
      onPress={() => handleCrewPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.crewIcon]}>
        <Text style={{fontSize: 28}}>{item.icon}</Text>
      </View>

      <View style={styles.crewInfo}>
        <Text style={styles.crewName}>{item.name}</Text>
        <Text style={styles.memberCount}>{item.members.length} members</Text>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Crews</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      ) : (
        <FlatList
          data={crews}
          keyExtractor={(item) => item.crew_id.toString()}
          renderItem={renderCrewItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>No crews yet</Text>
              <Text style={styles.emptySubtext}>
                Create or join a crew to start sharing recipes
              </Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },
  addButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  crewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderColor: '#FFF',
    borderWidth: 1,
  },
  crewIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  crewInfo: {
    flex: 1,
  },
  crewName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  }
});

export default MyCrewsScreen;