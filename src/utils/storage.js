let storage = {
  set(key, data){
    localStorage.setItem(key, JSON.stringify(data));
  },
  get(key){
    let value = localStorage.getItem(key);
    let re = /^(\{|\[)/;
    if(re.test(value)){
      return JSON.parse(value);
    }
    else{
      return value;
    }
  },
  remove(key){
    localStorage.removeItem(key);
  }
};

export default storage;