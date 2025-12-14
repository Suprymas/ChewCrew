import {supabase} from "../lib/supabase";

class FetchService {
  async callRPC(funcName) {
    try {
      const {data, error} = await supabase.rpc(funcName);

      if (error) throw error;

      return {data: data, error: null}
    }  catch (error) {
      return {data: null, error: error}
    }
  }

  async fetchTableSingleRowById(table, id) {
    try {
      const {data, error} = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      console.log(data)
      return {data: data, error: null}
    } catch (error) {
      return {data: null, error: error};
    }
  }

  getPublicUrl(bucket, filename) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return data;
  }
}

export default new FetchService();