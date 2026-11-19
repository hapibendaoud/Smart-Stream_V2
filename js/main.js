import { getData } from "./api.js";
import {addToFavorite} from "./api.js";
import {addToBlachList} from "./api.js";

const category = [];
const favorite = [];
const black_list = [];
let currentFilter = "";
let allChannels = [];


initApp();


const menu = document.getElementById("menu_icon");
const category_popup = document.getElementById("category_popup");
const close_popup = document.getElementById("close_popup");
const search = document.getElementById("search");
const channels_section = document.getElementById("channels_section");
const category_div = document.getElementById("category_div");
const all_channels = document.getElementById("all_channels");
const favorite_channels = document.getElementById("favorite_channels");

// View channels.
const videoElement = document.getElementById("video");
const name_channel = document.getElementById("name_channel");
const desc_chaennel = document.getElementById("desc_chaennel");
const category_name = document.getElementById("category_name");
const playing_now = document.getElementById("playing_now");

menu.addEventListener("click", (e) => {
    category_popup.classList.remove('-translate-x-full');
    document.body.classList.add("overflow-hidden");
});

close_popup.addEventListener("click", (e) => {
    category_popup.classList.add('-translate-x-full');
    document.body.classList.remove("overflow-hidden");
});

search?.addEventListener('input', e => {
    currentFilter = e.target.value.toLowerCase();
    renderFilteredChannels(); 
});
all_channels?.addEventListener("click", (e)=>{
    channels_section.innerHTML = "";
    channels(allChannels);
    category_div.querySelectorAll("article").forEach(item => {
        item.classList.remove("active");
    });
    favorite_channels.classList.remove("active");
    all_channels.classList.add("active");
    category_popup.classList.add('-translate-x-full');
    document.body.classList.remove("overflow-hidden");
})

favorite_channels?.addEventListener("click", async (e)=>{
    // const favoriteChannels = await favorite;
    channels_section.innerHTML = "";
    // console.log(favorite);
    channels(favorite);
    category_div.querySelectorAll("article").forEach(item => {
        item.classList.remove("active");
    });
    favorite_channels.classList.add("active");
    all_channels.classList.remove("active");
    category_popup.classList.add('-translate-x-full');
    document.body.classList.remove("overflow-hidden");
})


async function initApp() {
    allChannels = await getData();
    favorite.length = 0;
    black_list.length = 0;
    allChannels.forEach(ch => {
        if (ch.isFavorite && !favorite.includes(ch)) {
            favorite.push(ch);
        }
        if (ch.isBlackListe && !black_list.includes(ch)) {
            black_list.push(ch);
        }
    });
    // console.log(favorite);
    channelCategory(allChannels);
    categoryChannels(category);
    channels(allChannels);
}


function renderFilteredChannels() {
    const filtered = allChannels.filter(p => {
        const channelName = p.name || p.title || "";
        return channelName.toLowerCase().includes(currentFilter);
    });
    channels_section.innerHTML = "";
    channels(filtered); 
}

// function showToast(message, type = "success") {
//     let toast = document.getElementById("toast-notification");
//     if (!toast) {
//         toast = document.createElement("div");
//         toast.id = "toast-notification";
//         toast.className = "fixed bottom-5 right-5 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold transition-all duration-300 opacity-0 translate-y-2 pointer-events-none";
//         document.body.appendChild(toast);
//     }
//     toast.textContent = message;
//     toast.style.backgroundColor = type === "success" ? "#16a34a" : "#dc2626"; // Green for success, Red for error

//     toast.classList.remove("opacity-0", "translate-y-2");
//     toast.classList.add("opacity-100", "translate-y-0");

//     setTimeout(() => {
//         toast.classList.remove("opacity-100", "translate-y-0");
//         toast.classList.add("opacity-0", "translate-y-2");
//     }, 3000);
// }
all_channels.classList.add("active");
function channels(channel) {
    channels_section.innerHTML = "";
    channel.forEach(element => {
        if(element.isBlackListe !== true){
            const article = document.createElement("article");
            article.dataset.id = element.id;
            article.className = "flex items-center justify-between p-2 border border-[#07209C] rounded-lg mb-2 hover:bg-[#030A44] cursor-pointer";
            article.innerHTML = `
                <div class="flex items-center justify-between gap-4 w-full min-w-0">
                    <div class="flex gap-5 items-center h-fit min-w-0 flex-1">
                        <div class="bg-[#0B32F4] w-10 h-10 flex items-center justify-center text-lg font-bold rounded-lg italic text-white shrink-0">
                            ${element.countryCode || element.country.slice(0, 2)}
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-2 min-w-0">
                                <h2 class="font-bold text-white truncate min-w-0">${element.name}</h2>
                                <div class="relative shrink-0">
                                    <div class="absolute w-2 h-2 bg-[#2749F5] rounded-2xl animate-ping"></div>
                                    <div class="relative w-2 h-2 bg-[#2749F5] rounded-2xl"></div>
                                </div>
                            </div>
                            <p class="text-xs text-gray-400 truncate">${element.category || 'Description'} ${element.channelNumber}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                        <button class="add-to-favorite rounded-lg px-1 cursor-pointer text-amber-300 text-2xl hover:bg-gray-700">${element.isFavorite? `★`:`☆`}</button>
                            <div class="relative">
                                <button class="channels_option p-1.5 text-gray-300 hover:text-white hover:bg-[#07209C]/50 rounded-lg cursor-pointer transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                </button>

                                <div class="popup-menu hidden absolute right-0 mt-2 w-32 bg-[#041259] border border-[#07209C] rounded-lg shadow-xl z-50 overflow-hidden">
                                    <button class="edit_btn w-full text-left px-4 py-2 text-sm text-white hover:bg-[#0B32F4] flex items-center gap-2 cursor-pointer transition">
                                        <span>✏️</span> Edit
                                    </button>
                                    <button class="blacklist_btn w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2 cursor-pointer transition border-t border-[#07209C]/50">
                                        <span></span> Black List
                                    </button>
                                </div>
                            </div>
                    </div>`;
            
            channels_section.append(article);

            article.addEventListener("click", async (e) => {
                const channel_active = e.currentTarget.dataset.id;
                const finded_channel = allChannels.find(item => item.id === channel_active);
                
                const optionBtn = e.target.closest(".channels_option");
                if (optionBtn) {
                    e.stopPropagation();
                    const popupMenu = article.querySelector(".popup-menu");
                    if (popupMenu) {
                        document.querySelectorAll(".popup-menu").forEach(menu => {
                            if (menu !== popupMenu) menu.classList.add("hidden");
                        });
                        popupMenu.classList.toggle("hidden");
                    }
                    return;
                }
                
                const add_to_favorite = e.target.closest(".add-to-favorite");
                if (add_to_favorite) {
                    e.stopPropagation();

                    if (finded_channel) {
                        const newFavoriteState = !finded_channel.isFavorite;
                        finded_channel.isFavorite = newFavoriteState;
                        add_to_favorite.textContent = newFavoriteState ? `★` : `☆`;

                        if (newFavoriteState) {
                            if (!favorite.includes(finded_channel)) {
                                favorite.push(finded_channel);
                            }
                        } else {
                            const index = favorite.indexOf(finded_channel);
                            if (index > -1) {
                                favorite.splice(index, 1);
                            }
                        }

                        channels_section.innerHTML = "";
                        if (favorite_channels.classList.contains("active")) {
                            channels(favorite);
                        } else if (all_channels.classList.contains("active")) {
                            channels(allChannels);
                        }
                        await addToFavorite(newFavoriteState, channel_active);
                    }
                    return;
                }
                const edit_btn = e.target.closest(".blacklist_btn");
                if (edit_btn) {
                    e.stopPropagation();
                    const popupMenu = article.querySelector(".popup-menu");
                    if (confirm("Are you sure you wanna hide the channle!!")){
                        popupMenu.classList.add("hidden");
                        console.log("Edit clicked for channel ID:", channel_active);
                        await addToBlachList(true, channel_active);
                        await initApp();
                        // console.log(channel_active);
                    }
                    return;
                }

                if (finded_channel && finded_channel.streamUrl) {
                    if (videoElement) {
                        if (name_channel) name_channel.textContent = finded_channel.name;
                        if (desc_chaennel) desc_chaennel.textContent = finded_channel.channelNumber || '';
                        if (category_name) category_name.textContent = finded_channel.category || '';
                        if (playing_now) playing_now.textContent = finded_channel.epg?.currentProgram || 'Live Stream';

                        const streamUrl = finded_channel.streamUrl;

                        if (window.Hls && Hls.isSupported()) {
                            if (window.currentHlsPlayer) {
                                window.currentHlsPlayer.destroy();
                            }
                            const hls = new Hls();
                            window.currentHlsPlayer = hls;
                            hls.loadSource(streamUrl);
                            hls.attachMedia(videoElement);
                            
                            hls.on('manifestParsed', () => {
                                videoElement.play().catch(err => console.log("Auto-play prevented:", err));
                            });
                        }
                    }
                }
            });
        }
    });
}

document.addEventListener("click", (e) => {
    if (!e.target.closest(".channels_option") && !e.target.closest(".popup-menu")) {
        document.querySelectorAll(".popup-menu").forEach(menu => {
            menu.classList.add("hidden");
        });
    }
});

function categoryChannels(cate) {
    category_div.innerHTML = "";
    cate.forEach(element => {
        const article = document.createElement("article");
        article.dataset.id = element.id;
        article.className = "flex items-center gap-2 border border-[#0929C8] p-1 rounded-lg cursor-pointer mb-2 hover:bg-[#071B9C]";
        article.innerHTML = `
            <div class="bg-[#0B32F4] w-8 h-8 flex items-center justify-center text-lg rounded-lg italic text-white font-bold">${element.countryCode}</div>
            <h2 class="italic uppercase text-white">${element.country}</h2>
        `;
        
        category_div.append(article);
        
        article.addEventListener("click", (e) => {
            const countryId = Number(e.currentTarget.dataset.id);
            const countryobject = category.find(item => item.id === countryId);
            
            if (countryobject) {
                category_div.querySelectorAll("article").forEach(item => {
                    item.classList.remove("active");
                });
                all_channels.classList.remove("active");
                e.currentTarget.classList.add("active");

                const filteredByCountry = allChannels.filter(channel => 
                    countryobject.channlesId.includes(channel.id)
                );
                channels_section.innerHTML = "";
                channels(filteredByCountry);
                
                category_popup.classList.add('-translate-x-full');
                document.body.classList.remove("overflow-hidden");
            }
        });
    });
}

function channelCategory(fetchedChannels) {
    fetchedChannels.forEach(element => {
        const existingCategory = category.find(existingObj => existingObj.country === element.country);
        
        if (!existingCategory) {
            category.push({
                id: category.length > 0 ? Number(category[category.length - 1].id) + 1 : 1,
                country: element.country,
                channlesId: [element.id],
                countryCode: element.countryCode,
            });
        } else {
            existingCategory.channlesId.push(element.id);
        }
    });
    // console.log(category);
    
}