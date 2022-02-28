

const loginReducer = (prevState, action) => {
  switch (action.type){
    case 'RETRIEVE_TOKEN':
    return {
      ...prevState,
      userToken: action.userToken,
      isLoading: false,
    };
    case 'LOGIN':
    return {
      ...prevState,
      userName: action.id,
      userToken: action.userToken,
      isLoading: false,
    };
    case 'LOGOUT':
    return {
      ...prevState,
      userName: null,
      userToken: null,
      isLoading: false,
    };
    case 'REGISTER':
    return {
      ...prevState,
      userName: action.id,
      userToken: action.userToken,
      isLoading: false,
    }
    
    case 'PROFILE':
    return {
      ...prevState,
      profile: action.profile,
      isLoading: false,
    }
  }
}

export default loginReducer