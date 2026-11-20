const url = "https://6af42fce55a1de7dcf03ae98.mockapi.io/smartStream/channels";

export function showToast(message, type = "success") {
    let toast = document.getElementById("toast-notification");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-notification";
        toast.className = "fixed bottom-5 right-5 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold pointer-events-none transition-all duration-300";
        toast.style.zIndex = "99999";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.backgroundColor = type === "success" ? "#16a34a" : "#dc2626";

    if (toast._hideTimeout) {
        clearTimeout(toast._hideTimeout);
    }

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    toast._hideTimeout = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";
    }, 4000);
}

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
        const channels_section = document.getElementById("channels_section");

        let errorMessage = "An unexpected error occurred while loading channels.";
        if (!navigator.onLine || e instanceof TypeError) {
            errorMessage = "Unable to reach the server. Please check your internet connection or MockAPI URL.";
        } else if (e?.message) {
            errorMessage = `Failed to load channels`;
        }

        if (channels_section) {
            channels_section.innerHTML = `
                <div class="mt-8 flex flex-col items-center gap-3 text-center px-4">
                    <p class="text-sm text-red-400 font-medium">${errorMessage}</p>
                    <button class="reload_btn bg-transparent hover:bg-blue-950 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-3xl cursor-pointer transition">
                        Reload channels
                    </button>
                </div>`;

            document.querySelector(".reload_btn")?.addEventListener("click", () => {
                window.location.reload();
            });
        }
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
        } else {
            if(data === true){
                showToast("Added to Favorite list seccessfully!");
            } else {
                showToast("Remove from Favorite list seccessfully!", "error");
            };
        };

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
        }  else {
            if(data === true){
                showToast("Added to Black list seccessfully!", "error");
            } else {
                showToast("Remove from Black list seccessfully!");
            };
        }

        const result = await response.json();
        console.log('Success:', result);
        return result;
    } catch (error) {
        console.error('Error updating resource:', error);
    }
}
// addToBlachList(true, 1);
const new_ch = {
    id: "100",
    channelNumber: "3100",
    name: "AR - Dubai TV 7 4K",
    category: "ENTERTAINMENT",
    country: "United Arab Emirates",
    countryCode: "AE",
    logo: "https://via.placeholder.com/60x60?text=DubaiTV",
    previewImage: "https://via.placeholder.com/800x450?text=Dubai+TV+Show",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    isLive: true,
    epg: {
            currentProgram: "دبي اليوم (Ep. 62)",
            startTime: "18:30",
            endTime: "19:45",
            progressPercentage: 41
        }
    };

export async function postData(data) {
    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
            showToast("Added a new channel seccessfully!");
        }

        const result = await response.json();
        console.log('Success:', result);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}
postData(new_ch);

export async function deleteChannel(id) {
    try {
        const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer YOUR_TOKEN',
            'Content-Type': 'application/json'
        }
        });

        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (response.status === 204) {
        console.log('Resource deleted successfully');
        return;
        }

        const data = await response.json();
        console.log('Deleted:', data);
    } catch (error) {
        console.error('Failed to delete resource:', error);
    }
}
// deleteChannel(100);