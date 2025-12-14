import {supabase} from "../lib/supabase";

class PostService {

  async postRPC(funcName, params) {
    try {
      const {data, error} = await supabase.rpc(funcName, params);

      if (error) throw error;

      return {data: data, error: null}
    }  catch (error) {
      return {data: null, error: error}
    }
  }

  async createCrew({ name, icon, creatorId }) {
    try {
      const { data, error } = await supabase
        .from('crew')
        .insert({
          name: name.trim(),
          icon: icon,
          creator: creatorId
        })
        .select();

      if (error) throw error;

      return { data: data?.[0] || null, error: null };
    } catch (error) {
      console.error('Create crew error:', error);
      return { data: null, error };
    }
  }

  async uploadToBucket(bucket, fileName, fileData, options = {}) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileData, options);

      if (error) throw error;
      return null;
    }  catch (error) {
      return { error: error};
    }
  }

  async insertData(table, data) {
    try {
      const { error } = await supabase
        .from(table)
        .insert(data)
      if (error) throw error;

    } catch (error) {
      return error;
    }
    return null;
  }
}

export default new PostService();