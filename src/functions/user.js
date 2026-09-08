import axios from 'axios';

export const registerUser= async(user)=>{

    return await axios.post('/registerUser',
    	{user:user}
    );
};