export default function LoginReducer(state,action)
{
    switch(action.type)
    {
        case 'DISPLAY_ERROR':
            return {message:action.payload.message,success:false,header:action.payload.header}
        case 'CLEAR_ERROR':
            return {message:'',success:false,header:''}
        case 'SUCCESS':
            return {message:action.payload.message,success:true,header:action.payload.header}
        default:return state;
    }
}