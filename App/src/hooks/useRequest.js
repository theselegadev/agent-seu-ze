const useRequest = async (endpoint,setLoading,options = {}, params = "") => {
   try{
      setLoading(true);
      const url = "http://localhost:3000" + endpoint + params;
      const response = await fetch(url, options);
      const data = await response.json();
      setLoading(false);
      return data;
   }catch(error){
      console.error("Request failed:", error);
      throw error;
   } 
}

export default useRequest;