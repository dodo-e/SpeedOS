const apiKey='45a30abbea3343b8b930619bc03ab986';const queryTopic='technology';const newsApiUrl=`https://newsapi.org/v2/top-headlines?country=us&category=${queryTopic}&pageSize=5&apiKey=${apiKey}`;let newsWindowElement;let weatherWindowElement;let iframeWindowElement;let urlHistory=[];let historyIndex=-1;function closeWindow(windowElement){if(windowElement){windowElement.style.display='none'}}
function openNewsWindow(){if(newsWindowElement){newsWindowElement.style.display='block';fetchLatestNews()}}
function closeNewsWindow(){closeWindow(newsWindowElement)}
function openWeatherWindow(){if(weatherWindowElement){weatherWindowElement.style.display='block';fetchWeatherData()}}
function closeWeatherWindow(){closeWindow(weatherWindowElement)}
async function fetchWeatherData(){const weatherContent=document.getElementById('weather-content');if(navigator.geolocation){navigator.geolocation.getCurrentPosition(async(position)=>{const latitude=position.coords.latitude;const longitude=position.coords.longitude;const url=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,uv_index_max,sunset,sunrise&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation&timezone=auto&past_days=7`;try{const response=await fetch(url);if(!response.ok){throw new Error('Failed to fetch weather data')}
const data=await response.json();displayWeatherData(data)}catch(error){console.error('Error fetching weather:',error);weatherContent.innerHTML=`<p style="color: #ff6b6b;">خطأ في تحميل بيانات الطقس</p>`}},(error)=>{console.error('Geolocation error:',error);weatherContent.innerHTML=`<p style="color: #ff6b6b;">أرجوك اسمح بالوصول لموقعك الجغرافي</p>`})}else{weatherContent.innerHTML=`<p style="color: #ff6b6b;">المتصفح لا يدعم Geolocation</p>`}}
function displayWeatherData(data){const weatherContent=document.getElementById('weather-content');const daily=data.daily;const hourly=data.hourly;const timezone=data.timezone;const todayIndex=daily.time.length-1;const todayMax=daily.temperature_2m_max[todayIndex];const todayMin=daily.temperature_2m_min[todayIndex];const todayUV=daily.uv_index_max[todayIndex];const sunrise=daily.sunrise[todayIndex];const sunset=daily.sunset[todayIndex];const currentHourIndex=hourly.time.length-1;const currentTemp=hourly.temperature_2m[currentHourIndex];const apparentTemp=hourly.apparent_temperature[currentHourIndex];const humidity=hourly.relative_humidity_2m[currentHourIndex];const precipitation=hourly.precipitation[currentHourIndex];let html=`
        <div style="padding: 15px;">
            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #00d4ff;">📍 ${timezone}</h3>
            
            <div style="background-color: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #ffd700;">Today's Weather</h4>
                <p style="margin: 5px 0;">🌡️ High: ${todayMax}°C</p>
                <p style="margin: 5px 0;">❄️ Low: ${todayMin}°C</p>
                <p style="margin: 5px 0;">☀️ UV Index: ${todayUV}</p>
                <p style="margin: 5px 0;">🌅 Sunrise: ${new Date(sunrise).toLocaleTimeString()}</p>
                <p style="margin: 5px 0;">🌆 Sunset: ${new Date(sunset).toLocaleTimeString()}</p>
            </div>
            
            <div style="background-color: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #ffd700;">Current Conditions</h4>
                <p style="margin: 5px 0;">🌡️ Temperature: ${currentTemp}°C</p>
                <p style="margin: 5px 0;">🤔 Feels Like: ${apparentTemp}°C</p>
                <p style="margin: 5px 0;">💧 Humidity: ${humidity}%</p>
                <p style="margin: 5px 0;">🌧️ Precipitation: ${precipitation}mm</p>
            </div>
            
            <h4 style="color: #ffd700; margin-bottom: 10px;">7-Day Forecast</h4>
            <div style="max-height: 200px; overflow-y: auto;">
    `;for(let i=Math.max(0,daily.time.length-7);i<daily.time.length;i++){const date=new Date(daily.time[i]);const dateStr=date.toLocaleDateString();const max=daily.temperature_2m_max[i];const min=daily.temperature_2m_min[i];html+=`
            <div style="background-color: rgba(211, 22, 195, 0.2); padding: 8px; border-radius: 4px; margin-bottom: 5px;">
                <span style="font-weight: bold;">${dateStr}</span> - High: ${max}°C, Low: ${min}°C
            </div>
        `}
html+=`
            </div>
        </div>
    `;weatherContent.innerHTML=html}
function openIframeWindow(){if(iframeWindowElement){iframeWindowElement.style.display='block'}}
function closeIframeWindow(){closeWindow(iframeWindowElement)}
function minimizeWindow(windowName){let windowElement=null;let windowTitle='';let windowIcon='';if(windowName==='news'){windowElement=newsWindowElement;windowTitle='📰 News';windowIcon='Assets/News.png'}else if(windowName==='weather'){windowElement=weatherWindowElement;windowTitle='🌤️ Weather';windowIcon='https://raw.githubusercontent.com/breezy-weather/pixel-icon-provider/main/fastlane/metadata/android/en-US/images/icon.png'}else if(windowName==='iframe'){windowElement=iframeWindowElement;windowTitle='🌐 Browser';windowIcon='https://www.icons101.com/icon_ico/id_79048/browser.ico'}
if(!windowElement)return;windowElement.style.display='none';const taskbar=document.getElementById('taskbar');const btn=document.createElement('button');btn.className='taskbar-btn';btn.title=windowTitle;btn.innerHTML=`<img src="${windowIcon}" alt="${windowTitle}">`;btn.onclick=()=>{windowElement.style.display='block';btn.remove()};taskbar.appendChild(btn)}
function maximizeWindow(windowElement){if(!windowElement)return;windowElement.style.width=(window.innerWidth-20)+'px';windowElement.style.height=(window.innerHeight-20)+'px';windowElement.style.top='10px';windowElement.style.left='10px'}
function loadIframeUrl(){const urlInput=document.getElementById('iframe-url-input');const iframe=document.getElementById('content-iframe');let url=urlInput.value.trim();if(!url){alert('Please enter a URL');return}
if(!url.startsWith('http://')&&!url.startsWith('https://')){url='https://'+url}
loadUrlWithHistory(url)}
function loadUrlWithHistory(url){const iframe=document.getElementById('content-iframe');const urlInput=document.getElementById('iframe-url-input');try{if(historyIndex<urlHistory.length-1){urlHistory=urlHistory.slice(0,historyIndex+1)}
urlHistory.push(url);historyIndex++;iframe.src=url;urlInput.value=url;updateButtonStates();updateBrowserUserInfo()}catch(error){console.error('Error loading iframe:',error);alert('Error loading the website. Some websites may not allow embedding.')}}
function updateButtonStates(){const backBtn=document.getElementById('browser-back-btn');const forwardBtn=document.getElementById('browser-forward-btn');if(backBtn){backBtn.disabled=historyIndex<=0;backBtn.style.opacity=historyIndex<=0?'0.5':'1'}
if(forwardBtn){forwardBtn.disabled=historyIndex>=urlHistory.length-1;forwardBtn.style.opacity=historyIndex>=urlHistory.length-1?'0.5':'1'}}
function updateBrowserUserInfo(){const userInfoDiv=document.getElementById('browser-user-info');const urlInput=document.getElementById('iframe-url-input');const currentUrl=urlInput.value||'No site';if(userInfoDiv){userInfoDiv.textContent=`📍 ${currentUrl}`;userInfoDiv.title=currentUrl}}
function browserBack(){if(historyIndex>0){historyIndex--;const url=urlHistory[historyIndex];const iframe=document.getElementById('content-iframe');const urlInput=document.getElementById('iframe-url-input');iframe.src=url;urlInput.value=url;updateButtonStates();updateBrowserUserInfo()}}
function browserForward(){if(historyIndex<urlHistory.length-1){historyIndex++;const url=urlHistory[historyIndex];const iframe=document.getElementById('content-iframe');const urlInput=document.getElementById('iframe-url-input');iframe.src=url;urlInput.value=url;updateButtonStates();updateBrowserUserInfo()}}
function openLinkInIframe(url){if(!iframeWindowElement)return;if(iframeWindowElement.style.display==='none'){openIframeWindow()}
if(!url.startsWith('http://')&&!url.startsWith('https://')){url='https://'+url}
loadUrlWithHistory(url)}
async function fetchLatestNews(){const newsContainer=document.getElementById('news-feed');try{const response=await fetch(newsApiUrl);if(!response.ok){const errorData=await response.json();let errorMessage=`ops, loading news, please wait (${response.status})`;if(response.status===401){errorMessage+=' - key not true.'}else if(response.status===404){errorMessage+=' - (problem with API (wrong).'}else if(response.status===429){errorMessage+=' - you can not use this number of calls.'}
throw new Error(errorMessage)}
const data=await response.json();const articles=data.articles.slice(0,5);newsContainer.innerHTML='';articles.forEach(article=>{const newsItem=document.createElement('div');newsItem.classList.add('news-item');const newsImage=article.urlToImage?`<img src="${article.urlToImage}" style="max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 8px;">`:'';newsItem.innerHTML=`
                ${newsImage}
                <h3><a href="${article.url}" class="article-link">${article.title}</a></h3>
                <p>${article.description || 'no description'}</p>
                <span class="source">source: ${article.source.name}</span>
            `;newsContainer.appendChild(newsItem)})}catch(error){console.error("problem while getting news",error.message);newsContainer.innerHTML=`<p class="error">${error.message}</p>`}}
function makeElementDraggable(element,dragHandle){let pos1=0,pos2=0,pos3=0,pos4=0;const handleToUse=dragHandle||element;handleToUse.onmousedown=dragMouseDown;handleToUse.style.cursor='grab';function dragMouseDown(e){e=e||window.event;if(e.target.closest('.close-btn'))return;e.preventDefault();pos3=e.clientX;pos4=e.clientY;document.onmouseup=closeDragElement;document.onmousemove=elementDrag}
function elementDrag(e){e=e||window.event;e.preventDefault();pos1=pos3-e.clientX;pos2=pos4-e.clientY;pos3=e.clientX;pos4=e.clientY;element.style.top=(element.offsetTop-pos2)+"px";element.style.left=(element.offsetLeft-pos1)+"px"}
function closeDragElement(){document.onmouseup=null;document.onmousemove=null}}
document.addEventListener('DOMContentLoaded',()=>{const displayElements=document.querySelectorAll('.DisplayName');const savedName=localStorage.getItem('userName');if(savedName){displayElements.forEach(element=>{element.textContent=savedName})}
const newsLaunchIcon=document.getElementById('news-launch-icon');newsWindowElement=document.getElementById('news-feed-window');const closeNewsButton=document.getElementById('close-news-button');const minimizeNewsButton=document.getElementById('minimize-news-button');const maximizeNewsButton=document.getElementById('maximize-news-button');const weatherLaunchIcon=document.getElementById('weather-launch-icon');weatherWindowElement=document.getElementById('weather-window');const closeWeatherButton=document.getElementById('close-weather-button');const minimizeWeatherButton=document.getElementById('minimize-weather-button');const maximizeWeatherButton=document.getElementById('maximize-weather-button');const iframeLaunchIcon=document.getElementById('iframe-launch-icon');iframeWindowElement=document.getElementById('iframe-window');const closeIframeButton=document.getElementById('close-iframe-button');const minimizeIframeButton=document.getElementById('minimize-iframe-button');const maximizeIframeButton=document.getElementById('maximize-iframe-button');const iframeLoadButton=document.getElementById('iframe-load-button');const iframeUrlInput=document.getElementById('iframe-url-input');const browserBackBtn=document.getElementById('browser-back-btn');const browserForwardBtn=document.getElementById('browser-forward-btn');if(newsLaunchIcon&&newsWindowElement&&closeNewsButton){newsLaunchIcon.addEventListener('click',openNewsWindow);closeNewsButton.addEventListener('click',closeNewsWindow);minimizeNewsButton.addEventListener('click',()=>minimizeWindow('news'));maximizeNewsButton.addEventListener('click',()=>maximizeWindow(newsWindowElement))}
if(weatherLaunchIcon&&weatherWindowElement&&closeWeatherButton){weatherLaunchIcon.addEventListener('click',openWeatherWindow);closeWeatherButton.addEventListener('click',closeWeatherWindow);minimizeWeatherButton.addEventListener('click',()=>minimizeWindow('weather'));maximizeWeatherButton.addEventListener('click',()=>maximizeWindow(weatherWindowElement))}
if(iframeLaunchIcon&&iframeWindowElement&&closeIframeButton&&iframeLoadButton){iframeLaunchIcon.addEventListener('click',openIframeWindow);closeIframeButton.addEventListener('click',closeIframeWindow);minimizeIframeButton.addEventListener('click',()=>minimizeWindow('iframe'));maximizeIframeButton.addEventListener('click',()=>maximizeWindow(iframeWindowElement));iframeLoadButton.addEventListener('click',loadIframeUrl);browserBackBtn.addEventListener('click',browserBack);browserForwardBtn.addEventListener('click',browserForward);iframeUrlInput.addEventListener('keypress',(e)=>{if(e.key==='Enter'){loadIframeUrl()}});updateButtonStates();updateBrowserUserInfo()}
const newsHandle=newsWindowElement?newsWindowElement.querySelector('.drag-handle'):null;if(newsWindowElement&&newsHandle){makeElementDraggable(newsWindowElement,newsHandle)}
const weatherHandle=weatherWindowElement?weatherWindowElement.querySelector('.drag-handle'):null;if(weatherWindowElement&&weatherHandle){makeElementDraggable(weatherWindowElement,weatherHandle)}
const iframeHandle=iframeWindowElement?iframeWindowElement.querySelector('.drag-handle'):null;if(iframeWindowElement&&iframeHandle){makeElementDraggable(iframeWindowElement,iframeHandle)}
document.addEventListener('click',(e)=>{const link=e.target.closest('a');if(!link)return;if(link.classList.contains('app-link')){e.preventDefault();const url=link.getAttribute('href');if(url){if(iframeWindowElement&&iframeWindowElement.style.display==='none'){openIframeWindow()}
openLinkInIframe(url)}
return}
if(link.getAttribute('target')==='_blank'&&!link.classList.contains('article-link'))return;if(link.classList.contains('article-link')||(link.href&&!link.getAttribute('target'))){e.preventDefault();let url=link.getAttribute('href');if(url&&url.includes('/url?')){const urlParams=new URLSearchParams(url.split('?')[1]);const realUrl=urlParams.get('q');if(realUrl){url=realUrl}}
if(url){openLinkInIframe(url)}}})})