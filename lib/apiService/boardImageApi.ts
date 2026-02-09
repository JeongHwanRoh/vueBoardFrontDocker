import axiosApi from '~/lib/apiService/axiosApi';


export const uploadImage=async(file:File)=>{
    const formData=new FormData();
    formData.append("file",file);

    const res=await axiosApi.post("/board/image/upload",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        },
        withCredentials:true
    });

    return res.data as { imageUrl:string}

}