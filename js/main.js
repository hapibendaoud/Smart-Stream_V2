import { getData } from "./api.js";
import {addToFavorite} from "./api.js";
import {addToBlachList} from "./api.js";
import { postData } from "./api.js";
import { showToast } from "./api.js";
import {deleteChannel} from "./api.js";

const category = [];
const favorite = [];
const black_list = [];
let currentFilter = "";
let allChannels = [];
const CHANNEL_REGEX = {
    name: /^[a-zA-Z0-9\u0600-\u06FF\s._&-]{2,60}$/,
    category: /^[a-zA-Z\u0600-\u06FF\s-]{2,30}$/,
    country: /^[a-zA-Z\u0600-\u06FF\s-]{2,40}$/,
    countryCode: /^[A-Za-z]{2,3}$/,
    streamUrl: /^https?:\/\/[^\s/$.?#].[^\s]*$/i
};

initApp();


const menu = document.getElementById("menu_icon");
const category_popup = document.getElementById("category_popup");
const close_popup = document.getElementById("close_popup");
const search = document.getElementById("search");
const channels_section = document.getElementById("channels_section");
const category_div = document.getElementById("category_div");
const all_channels = document.getElementById("all_channels");
const favorite_channels = document.getElementById("favorite_channels");
const black_list_channels = document.getElementById("black_list_channels");
const add_btn = document.getElementById("add_btn");
const save_btn_popup = document.getElementById("save_btn_popup");
const close_popup_of_add = document.querySelectorAll(".close_popup_of_add");

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
    black_list_channels.classList.remove("active");
    all_channels.classList.add("active");
    category_popup.classList.add('-translate-x-full');
    document.body.classList.remove("overflow-hidden");
})

favorite_channels?.addEventListener("click", async (e)=>{
    channels_section.innerHTML = "";
    // console.log(favorite);
    channels(favorite);
    category_div.querySelectorAll("article").forEach(item => {
        item.classList.remove("active");
    });
    favorite_channels.classList.add("active");
    black_list_channels.classList.remove("active");
    all_channels.classList.remove("active");
    category_popup.classList.add('-translate-x-full');
    document.body.classList.remove("overflow-hidden");
})
black_list_channels?.addEventListener("click", async (e)=>{
    channels_section.innerHTML = "";
    console.log(black_list);
    blackListChannels(black_list);
    category_div.querySelectorAll("article").forEach(item => {
        item.classList.remove("active");
    });
    black_list_channels.classList.add("active");
    favorite_channels.classList.remove("active");
    all_channels.classList.remove("active");
    category_popup.classList.add('-translate-x-full');
    document.body.classList.remove("overflow-hidden");
})
// open popup
add_btn.addEventListener("click", ()=>{
    document.getElementById("popup").classList.remove("hidden");
})
// close popup
close_popup_of_add?.forEach(item=>{
    item.addEventListener("click", ()=>{
        document.getElementById("popup").classList.add("hidden");
    })
})
function validateChannelInputs({ name, category, country, countryCode, streamUrl }) {
    if (!CHANNEL_REGEX.name.test(name)) {
        return "Channel name must be 2-60 valid characters.";
    }
    if (category && !CHANNEL_REGEX.category.test(category)) {
        return "Category must contain letters only (2-30 characters).";
    }
    if (country && country !== "Unknown" && !CHANNEL_REGEX.country.test(country)) {
        return "Country must contain letters only (2-40 characters).";
    }
    if (countryCode && !CHANNEL_REGEX.countryCode.test(countryCode)) {
        return "Country code must be 2 or 3 letters (e.g. MA, US).";
    }
    if (!CHANNEL_REGEX.streamUrl.test(streamUrl)) {
        return "Stream URL must be a valid http:// or https:// link.";
    }
    return null;
}
save_btn_popup?.addEventListener("click", async (e)=>{
    const rawName = document.getElementById("channel_name")?.value.trim() || "";
    const rawCategory = document.getElementById("channel_category")?.value.trim().toUpperCase() || "GENERAL";
    const rawCountry = document.getElementById("channel_country")?.value.trim() || "Unknown";
    const rawCountryCode =
        document.getElementById("channel_country_code")?.value.trim().toUpperCase() ||
        (rawCountry !== "Unknown" ? rawCountry.slice(0, 2).toUpperCase() : "TV");
    const rawStreamUrl = document.getElementById("channel_stream_url")?.value.trim() || "";

    const validationError = validateChannelInputs({
        name: rawName,
        category: rawCategory,
        country: rawCountry,
        countryCode: rawCountryCode,
        streamUrl: rawStreamUrl
    });

    if (validationError) {
        showToast(validationError, "error");
        return;
    }

    const lastChannelNumber = allChannels.reduce((max, ch) => {
        const num = Number(ch.channelNumber);
        return Number.isFinite(num) && num > max ? num : max;
    }, 3000);

    const newChannel = {
        channelNumber: String(lastChannelNumber + 1),
        name: rawName,
        category: rawCategory,
        country: rawCountry,
        countryCode: rawCountryCode,
        logo: "Unknown",
        previewImage: "Unknown",
        streamUrl: rawStreamUrl,
        epg: {
            currentProgram: "Unknown",
            startTime: "18:30",
            endTime: "19:45",
            progressPercentage: 41
        },
        isFavorite: false,
        isBlackListe: false
    };

    await postData(newChannel);
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
    lastWatched();
}


function renderFilteredChannels() {
    const filtered = allChannels.filter(p => {
        const channelName = p.name || p.title || "";
        return channelName.toLowerCase().includes(currentFilter);
    });
    channels_section.innerHTML = "";
    channels(filtered); 
}


all_channels.classList.add("active");
function channels(channel) {
    channels_section.innerHTML = "";
    if (!channel || channel.length === 0) {
        channels_section.innerHTML = `<p class="text-gray-400 text-sm text-center py-6">No channels in Availible</p>`;
        return;
    }
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
                        localStorage.setItem("last_watched", channel_active);
                        
                        // console.log(e.currentTarget);
                        
                        channels_section.querySelectorAll("article").forEach(item => {
                            item.classList.remove("active_channel");
                        });
                        e.currentTarget.classList.add("active_channel");

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
function blackListChannels(channel) {
    channels_section.innerHTML = "";

    if (!channel || channel.length === 0) {
        channels_section.innerHTML = `<p class="text-gray-400 text-sm text-center py-6">No channels in Black List</p>`;
        return;
    }

    channel.forEach(element => {
        const article = document.createElement("article");
        article.dataset.id = element.id;
        article.className = "relative flex items-center justify-between p-2 border border-[#07209C] rounded-lg mb-2 hover:bg-[#030A44] cursor-pointer";
        article.innerHTML = `
            <div class="flex items-center justify-between gap-4 w-full min-w-0">
                <div class="flex gap-5 items-center h-fit min-w-0 flex-1">
                    <div class="bg-[#0B32F4] w-10 h-10 flex items-center justify-center text-lg font-bold rounded-lg italic text-white shrink-0">
                        ${element.countryCode || element.country?.slice(0, 2) || "TV"}
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 min-w-0">
                            <h2 class="font-bold text-white truncate min-w-0">${element.name}</h2>
                            <div class="relative shrink-0">
                                <div class="absolute w-2 h-2 bg-red-500 rounded-2xl animate-ping"></div>
                                <div class="relative w-2 h-2 bg-red-500 rounded-2xl"></div>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400 truncate">${element.category || 'Description'} ${element.channelNumber || ''}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <button class="add-to-favorite rounded-lg px-1 cursor-pointer text-amber-300 text-2xl hover:bg-gray-700">${element.isFavorite ? `★` : `☆`}</button>
                    <div class="relative">
                        <button class="channels_option p-1.5 text-gray-300 hover:text-white hover:bg-[#07209C]/50 rounded-lg cursor-pointer transition">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>

                        <div class="popup-menu hidden absolute right-0 mt-2 w-36 bg-[#041259] border border-[#07209C] rounded-lg shadow-xl z-50">
                            <button class="remove_btn w-full text-left px-4 py-2 text-sm text-white hover:bg-[#0B32F4] flex items-center gap-2 cursor-pointer transition rounded-t-lg">
                                <span>🗑️</span> Remove
                            </button>
                            <button class="blacklist_btn w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2 cursor-pointer transition border-t border-[#07209C]/50 rounded-b-lg">
                                <span>↩️</span> Restore
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;

        channels_section.append(article);

        article.addEventListener("click", async (e) => {
            const channel_active = e.currentTarget.dataset.id;
            const finded_channel = allChannels.find(item => String(item.id) === String(channel_active));
            
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

            const restoreBtn = e.target.closest(".blacklist_btn");
            if (restoreBtn && finded_channel) {
                e.stopPropagation();
                article.querySelector(".popup-menu")?.classList.add("hidden");

                finded_channel.isBlackListe = false;
                const idx = black_list.indexOf(finded_channel);
                if (idx > -1) black_list.splice(idx, 1);

                blackListChannels(black_list);
                await addToBlachList(false, channel_active);
            }
            const remove_btn = e.target.closest(".remove_btn");
            if (remove_btn && finded_channel) {
                if(confirm("Are you sure you wanna delete this channel!!!!")){
                    e.stopPropagation();
                    article.querySelector(".popup-menu")?.classList.add("hidden");

                    finded_channel.isBlackListe = false;
                    const idx = black_list.indexOf(finded_channel);
                    if (idx > -1) black_list.splice(idx, 1);

                    blackListChannels(black_list);
                    await deleteChannel(channel_active);
                    await initApp();
                }
            }

        });
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
                black_list_channels.classList.remove("active");
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
function lastWatched(){
    const last_watched_from_localStorege = localStorage.getItem("last_watched");
    if(last_watched_from_localStorege !== null){
        const finded = allChannels.find(item=> item.id === last_watched_from_localStorege);
        // console.log(finded);
        if (name_channel) name_channel.textContent = finded.name;
        if (desc_chaennel) desc_chaennel.textContent = finded.channelNumber || '';
        if (category_name) category_name.textContent = finded.category || '';
        if (playing_now) playing_now.textContent = finded.epg?.currentProgram || 'Live Stream';
        const streamUrl = finded.streamUrl;

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
        channels_section.querySelectorAll("article").forEach(item => {
            if(item.dataset.id === finded.id){
                item.classList.add("active_channel");
            }
        });
    }
}