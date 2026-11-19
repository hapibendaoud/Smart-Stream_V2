const url = "https://6af42fce55a1de7dcf03ae98.mockapi.io/smartStream/channels";

export const favorite = [];

export async function getData(){
    try{
        
        const response = await fetch(url);
        if(!response.ok){
            throw new error("Erorr: ", response.status);
        }
        const data = await response.json();
        if(!data){
            throw new error("Error Data type!!");
        }
        console.log(response.status);
        
        return data;
    } catch(e){
        console.error(e);
    } finally {
        const loading_channels = document.getElementById("channels_loading");
        loading_channels?.classList.add("hidden");
    }
}

export async function addToFavorite(data, id) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
        },
        body: JSON.stringify({isFavorite: data}) 
        });

        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Success:');
        return result;
    } catch (error) {
        console.error('Error updating resource:', error);
    }
}
// addToFavorite(true , 1);

export async function addToBlachList(data, id) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
        },
        body: JSON.stringify({isBlackListe: data})
        });

        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Success:', result);
        return result;
    } catch (error) {
        console.error('Error updating resource:', error);
    }
}
// addToBlachList(true, 1);