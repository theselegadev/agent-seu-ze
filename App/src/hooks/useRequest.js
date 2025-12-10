const useRequest = async (endpoint, options = {}, params = "") => {
   try{
        const url = "http://localhost:3000" + endpoint + params;
        const response = await fetch(url, options);
        return await response.json();
   }catch(error){
      console.error("Request failed:", error);
      throw error;
   } 
}

export default useRequest;