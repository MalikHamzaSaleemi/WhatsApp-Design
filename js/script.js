
let getById = (id, parent) => parent ? parent.getElementById(id) : getById(id, document);
let getByClass = (className, parent) => parent ? parent.getElementsByClassName(className) : getByClass(className, document);

const DOM =  {
	chatListArea: getById("chat-list-area"),
	messageArea: getById("message-area"),
	inputArea: getById("input-area"),
	chatList: getById("chat-list"),
	messages: getById("messages"),
	chatListItem: getByClass("chat-list-item"),
	messageAreaName: getById("name", this.messageArea),
	messageAreaPic: getById("pic", this.messageArea),
	messageAreaNavbar: getById("navbar", this.messageArea),
	messageAreaDetails: getById("details", this.messageAreaNavbar),
	messageAreaOverlay: getByClass("overlay", this.messageArea)[0],
	messageInput: getById("input"),
	profileSettings: getById("profile-settings"),
	profilePic: getById("profile-pic"),
	profilePicInput: getById("profile-pic-input"),
	inputName: getById("input-name"),
	username: getById("username"),
	displayPic: getById("display-pic"),
};

let mClassList = (element) => {
	return {
		add: (className) => {
			element.classList.add(className);
			return mClassList(element);
		},
		remove: (className) => {
			element.classList.remove(className);
			return mClassList(element);
		},
		contains: (className, callback) => {
			if (element.classList.contains(className))
				callback(mClassList(element));
		}
	};
};

// 'areaSwapped' is used to keep track of the swapping
// of the main area between chatListArea and messageArea
// in mobile-view
let areaSwapped = false;

// 'chat' is used to store the current chat
// which is being opened in the message area
let chat = null;

// this will contain all the chats that is to be viewed
// in the chatListArea
let chatList = [];

// this will be used to store the date of the last message
// in the message area
let lastDate = "";

// 'populateChatList' will generate the chat list
// based on the 'messages' in the datastore
let populateChatList = () => {
	chatList = [];

	// 'present' will keep track of the chats
	// that are already included in chatList
	// in short, 'present' is a Map DS
	let present = {};

	MessageUtils.getMessages()
	.sort((a, b) => mDate(a.time).subtract(b.time))
	.forEach((msg) => {
		let chat = {};
		
		chat.isGroup = msg.recvIsGroup;
		chat.msg = msg;

		if (msg.recvIsGroup) {
			chat.group = groupList.find((group) => (group.id === msg.recvId));
			chat.name = chat.group.name;
		} else {
			chat.contact = contactList.find((contact) => (msg.sender !== user.id) ? (contact.id === msg.sender) : (contact.id === msg.recvId));
			chat.name = chat.contact.name;
		}

		chat.unread = (msg.sender !== user.id && msg.read_status < 2) ? 1: 0;

		if (present[chat.name] !== undefined) {
			chatList[present[chat.name]].msg = msg;
			chatList[present[chat.name]].unread += chat.unread;
		} else {
			present[chat.name] = chatList.length;
			chatList.push(chat);
		}
	});
};

let viewChatList = () => {
	DOM.chatList.innerHTML = "";
	chatList
	.sort((a, b) => mDate(b.msg.time).subtract(a.msg.time))
	.forEach((elem, index) => {
		let statusClass = elem.msg.status < 2 ? "far" : "fas";
		let unreadClass = elem.unread ? "unread" : "";
/*if needs to display the tick icon with the message 
<div class="small last-message">${elem.isGroup ? contactList.find(contact => contact.id === elem.msg.sender).name + ": " : ""}${elem.msg.sender === user.id ? "<i class=\"" + statusClass + " fa-check-circle mr-1\"></i>" : ""} ${elem.msg.body}</div>
*/

			DOM.chatList.innerHTML += `
		<div class="chat-list-item d-flex flex-row w-100 p-2 border-bottom ${unreadClass}" onclick="generateMessageArea(this, ${index})">
			<img src="${elem.isGroup ? elem.group.pic : elem.contact.pic}" alt="Profile Photo" class="img-fluid rounded-circle mr-2" style="height:50px;">
		
		
			<div class="w-50">
				<div class="name list-user-name">${elem.name}</div>
				<div class="small last-message">${elem.isGroup ? contactList.find(contact => contact.id === elem.msg.sender).name + ": " : ""}${elem.msg.sender === user.id ? 
					"" : ""} ${elem.msg.body}</div>

			</div>
			
			<div class="flex-grow-1 text-right">
				<div class="small time">${mDate(elem.msg.time).chatListFormat()}</div>
				${elem.unread ? "<div class=\"badge badge-success badge-pill small\" id=\"unread-count\">" + elem.unread + "</div>" : ""}
			</div>
		</div>
		`;
	});
};

let generateChatList = () => {
	populateChatList();
	viewChatList();
};




let addDateToMessageArea = (date) => {
	DOM.messages.innerHTML += `
	<div class="mx-auto my-2  text-dark small py-1 px-2 rounded"  style="visibility: hidden;">
		//${date}
	</div>
	`;
};
let addunreadToMessageArea = {
    addUnread: function() {
	
		DOM.messages.innerHTML += `
 <div class="notification-wrapper">
  <div class="unread-messages">
        1 UNREAD MESSAGES
    </div>
</div>
<div class="icon-container">
<div class="notification-count">1</div>
					<div class="icon"><svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0.344159 0.344159C0.56459 0.123794 0.863519 0 1.17521 0C1.4869 0 1.78583 0.123794 2.00626 0.344159L7.82479 6.16269L13.6433 0.344159C13.865 0.130039 14.1619 0.0115592 14.4701 0.0142373C14.7783 0.0169155 15.0732 0.140538 15.2911 0.358478C15.509 0.576418 15.6327 0.871238 15.6353 1.17944C15.638 1.48764 15.5195 1.78457 15.3054 2.00626L8.65584 8.65584C8.43541 8.87621 8.13648 9 7.82479 9C7.5131 9 7.21417 8.87621 6.99374 8.65584L0.344159 2.00626C0.123794 1.78583 0 1.4869 0 1.17521C0 0.863519 0.123794 0.564591 0.344159 0.344159Z" fill="#687780"/>
				</svg></div> <!-- This is a down arrow symbol -->
				</div>
        `;
    }
};


function makeformatDate(dateString) {
	  const date = new Date(dateString);
    const now = new Date();

    // Check if the date is today
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
        // Format for the same day
        const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleTimeString('en-US', optionsTime).replace(':00', ''); // Removing seconds
    } else {
        // Format for a different day
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

let addMessageToMessageArea = (msg) => {
    let msgDate = mDate(msg.time).getDate();
    if (lastDate != msgDate) {
        addDateToMessageArea(msgDate);
        lastDate = msgDate;
    }
    
    var alert_message = msg.read_status;
    
    if (alert_message == 1) {
        addunreadToMessageArea.addUnread();
    }

    let sendStatus = `<i class="${msg.status < 2 ? "far" : "fas"} fa-check-circle"></i>`;

    let profileImage = `<img src="${chat.isGroup ? chat.group.pic : chat.contact.pic}" alt="Profile Photo" class="img-fluid rounded-circle mr-2" style="height:50px; width:50px;">`;

    // Find sender name
    let senderName = '';
    if (msg.sender === user.id) {
        senderName = user.name;
    } else {
        const contact = contactList.find(c => c.id === msg.sender);
        senderName = contact ? contact.name : 'Unknown Sender';
    }

	DOM.messages.innerHTML += `
	<div class="ml-3">
	  ${msg.sender === user.id ? '' : profileImage}
	  <div class="">
		<div class="align-self-${msg.sender === user.id ? 'end self' : 'start'} d-flex flex-row align-items-center 
		  p-1 my-1 mx-3 rounded message-item ${msg.sender === user.id ? 'right-nidle' : 'left-nidle'}" data-message-id="${msg.id}">
		  <div style="margin-top:-4px">
			<div class="shadow-sm" style="background:${msg.sender === user.id ? '#dcf8c6' : 'white'}; padding:10px; border-radius:5px;">
			  ${msg.body}
			</div>
			<div>
			  <div style="color: #463C3C; font-size:14px; font-weight:400; margin-top: 10px; width: 100%; background-color: transparent;">
				<span style="color: #463C3C; cursor: pointer; text-decoration: underline; color: #666;">${senderName}</span> |
				<span style="color: #463C3C; cursor: pointer; text-decoration: underline; color: #666;">(${makeformatDate(msg.time)})</span> |
				<span style="color: #463C3C; cursor: pointer; text-decoration: underline; color: #666;">
				  <a href="#" style="color: #463C3C; font-size:14px; font-weight:400; cursor: pointer; text-decoration: underline; 
				  color: #666;" data-toggle="modal" data-target="#seenModal">Seen</a>
				</span> |
				<span style="color: #463C3C; cursor: pointer; text-decoration: underline; color: #666;">
				  <a href="#" style="color: #463C3C; font-size:14px; font-weight:400; cursor: pointer; text-decoration: 
				  underline; color: #666;" id="reply-link" onclick="showReply()" data-message-id="${msg.id}">Reply</a>
				</span> |
				<span>
				  <a href="#" style="color: #463C3C; font-size:14px; font-weight:400; cursor: pointer; text-decoration: underline; 
				  color: #666;" data-toggle="modal" data-target="#deleteModal">Delete</a>
				</span>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	</div>
	`;
	

    DOM.messages.scrollTo(0, DOM.messages.scrollHeight);
};


let generateMessageArea = (elem, chatIndex) => {
	chat = chatList[chatIndex];

	mClassList(DOM.inputArea).contains("d-none", (elem) => elem.remove("d-none").add("d-flex"));
	mClassList(DOM.messageAreaOverlay).add("d-none");

	[...DOM.chatListItem].forEach((elem) => mClassList(elem).remove("active"));

	mClassList(elem).contains("unread", () => {
		 MessageUtils.changeStatusById({
			isGroup: chat.isGroup,
			id: chat.isGroup ? chat.group.id : chat.contact.id
		});
		mClassList(elem).remove("unread");
		mClassList(elem.querySelector("#unread-count")).add("d-none");
	});

	if (window.innerWidth <= 575) {
		mClassList(DOM.chatListArea).remove("d-flex").add("d-none");
		mClassList(DOM.messageArea).remove("d-none").add("d-flex");
		areaSwapped = true;
	} else {
		mClassList(elem).add("active");
	}

	DOM.messageAreaName.innerHTML = chat.name;
	DOM.messageAreaPic.src = chat.isGroup ? chat.group.pic : chat.contact.pic;
	
	// Message Area details ("last seen ..." for contacts / "..names.." for groups)
	if (chat.isGroup) {
		let groupMembers = groupList.find(group => group.id === chat.group.id).members;
		let memberNames = contactList
				.filter(contact => groupMembers.indexOf(contact.id) !== -1)
				.map(contact => contact.id === user.id ? "You" : contact.name)
				.join(", ");
		
		DOM.messageAreaDetails.innerHTML = `${memberNames}`;
	} else {
		DOM.messageAreaDetails.innerHTML = `last seen ${mDate(chat.contact.lastSeen).lastSeenFormat()}`;
	}

	let msgs = chat.isGroup ? MessageUtils.getByGroupId(chat.group.id) : MessageUtils.getByContactId(chat.contact.id);

	DOM.messages.innerHTML = "";

	lastDate = "";
	msgs
	.sort((a, b) => mDate(a.time).subtract(b.time))
	.forEach((msg) => addMessageToMessageArea(msg));
};

let showChatList = () => {
	if (areaSwapped) {
		mClassList(DOM.chatListArea).remove("d-none").add("d-flex");
		mClassList(DOM.messageArea).remove("d-flex").add("d-none");
		areaSwapped = false;
	}
};

let sendMessage = () => {
	let value = DOM.messageInput.value;
	DOM.messageInput.value = "";
	if (value === "") return;

	let msg = {
		sender: user.id,
		body: value,
		time: mDate().toString(),
		status: 1,
		recvId: chat.isGroup ? chat.group.id : chat.contact.id,
		recvIsGroup: chat.isGroup
	};

	addMessageToMessageArea(msg);
	MessageUtils.addMessage(msg);
	generateChatList();
};

let showProfileSettings = () => {
	DOM.profileSettings.style.left = 0;
	DOM.profilePic.src = user.pic;
	DOM.inputName.value = user.name;
};

let hideProfileSettings = () => {
	DOM.profileSettings.style.left = "-110%";
	DOM.username.innerHTML = user.name;
};

window.addEventListener("resize", e => {
	if (window.innerWidth > 575) showChatList();
});

let init = () => {
	DOM.username.innerHTML = user.name;
	DOM.displayPic.src = user.pic;
	DOM.profilePic.stc = user.pic;
	DOM.profilePic.addEventListener("click", () => DOM.profilePicInput.click());
	DOM.profilePicInput.addEventListener("change", () => console.log(DOM.profilePicInput.files[0]));
	DOM.inputName.addEventListener("blur", (e) => user.name = e.target.value);
	generateChatList();

	console.log("Click the Image at top-left to open settings.");
};

init();







//Code to send the message 
const voiceIcon = document.getElementById('voice-icon');
const voiceSvg = document.getElementById('voice-svg');
const chatInputContainer = document.querySelector('.chat-input-container');

const stickerMenu = document.getElementById('sticker-menu');
const chatInput = document.querySelector('.chat-input');
const fileIcon = document.getElementById('file-icon');
const fileInput = document.getElementById('file-input');

let mediaRecorder;
let chunks = [];

const startRecording = () => {
	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(stream => {
			mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.start();
			chatInputContainer.classList.add('recording-active');
			voiceIcon.classList.add('recording');
			
			// Change SVG to pause icon
			voiceSvg.innerHTML = `
				<circle cx="15.5" cy="15.5" r="15.5" fill="#1DAB61"/>
<path d="M11.6667 9C11.2246 9 10.8007 9.18061 10.4882 9.5021C10.1756 9.82359 10 10.2596 10 10.7143V19.2857C10 19.7404 10.1756 20.1764 10.4882 20.4979C10.8007 20.8194 11.2246 21 11.6667 21C12.1087 21 12.5326 20.8194 12.8452 20.4979C13.1577 20.1764 13.3333 19.7404 13.3333 19.2857V10.7143C13.3333 10.2596 13.1577 9.82359 12.8452 9.5021C12.5326 9.18061 12.1087 9 11.6667 9ZM18.3333 9C17.8913 9 17.4674 9.18061 17.1548 9.5021C16.8423 9.82359 16.6667 10.2596 16.6667 10.7143V19.2857C16.6667 19.7404 16.8423 20.1764 17.1548 20.4979C17.4674 20.8194 17.8913 21 18.3333 21C18.7754 21 19.1993 20.8194 19.5118 20.4979C19.8244 20.1764 20 19.7404 20 19.2857V10.7143C20 10.2596 19.8244 9.82359 19.5118 9.5021C19.1993 9.18061 18.7754 9 18.3333 9Z" fill="white"/>

			`;

			mediaRecorder.ondataavailable = event => {
				chunks.push(event.data);
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(chunks, { type: 'audio/wav' });
				const audioUrl = URL.createObjectURL(blob);
				const audio = new Audio(audioUrl);
				audio.play();

				// Create a download link for the recorded audio
				const downloadLink = document.createElement('a');
				downloadLink.href = audioUrl;
				downloadLink.download = 'recording.wav';
				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);

				chunks = [];
				chatInputContainer.classList.remove('recording-active');
				voiceIcon.classList.remove('recording');

				// Change SVG back to voice icon
				voiceSvg.innerHTML = `
					<circle cx="15.5" cy="15.5" r="15.5" fill="#1DAB61"/>
					<path d="M15.125 17.2143C16.8146 17.2143 18.1684 15.8504 18.1684 14.1607L18.1786 8.05357C18.1786 6.36393 16.8146 5 15.125 5C13.4354 5 12.0714 6.36393 12.0714 8.05357V14.1607C12.0714 15.8504 13.4354 17.2143 15.125 17.2143ZM20.5196 14.1607C20.5196 17.2143 17.9343 19.3518 15.125 19.3518C12.3157 19.3518 9.73036 17.2143 9.73036 14.1607H8C8 17.6316 10.7686 20.502 14.1071 21.0007V24.3393H16.1429V21.0007C19.4814 20.5121 22.25 17.6418 22.25 14.1607H20.5196Z" fill="white"/>
				`;
			};

			stream.oninactive = () => {
				mediaRecorder.stop();
			};
		})
		.catch(error => {
			console.error('Error accessing media devices.', error);
			chatInputContainer.classList.remove('recording-active');
			voiceIcon.classList.remove('recording');
			
			// Change SVG back to voice icon
			voiceSvg.innerHTML = `
				<circle cx="15.5" cy="15.5" r="15.5" fill="#1DAB61"/>
				<path d="M15.125 17.2143C16.8146 17.2143 18.1684 15.8504 18.1684 14.1607L18.1786 8.05357C18.1786 6.36393 16.8146 5 15.125 5C13.4354 5 12.0714 6.36393 12.0714 8.05357V14.1607C12.0714 15.8504 13.4354 17.2143 15.125 17.2143ZM20.5196 14.1607C20.5196 17.2143 17.9343 19.3518 15.125 19.3518C12.3157 19.3518 9.73036 17.2143 9.73036 14.1607H8C8 17.6316 10.7686 20.502 14.1071 21.0007V24.3393H16.1429V21.0007C19.4814 20.5121 22.25 17.6418 22.25 14.1607H20.5196Z" fill="white"/>
				`;
		});
};

voiceIcon.addEventListener('mousedown', () => {
	startRecording();
});

voiceIcon.addEventListener('mouseup', () => {
	if (mediaRecorder && mediaRecorder.state === 'recording') {
		mediaRecorder.stop();
	}
});

voiceIcon.addEventListener('touchstart', () => {
	startRecording();
});

voiceIcon.addEventListener('touchend', () => {
	if (mediaRecorder && mediaRecorder.state === 'recording') {
		mediaRecorder.stop();
	}
});



// Open file input dialog when clicking on file icon
fileIcon.addEventListener('click', () => {
	fileInput.click();
});

// Handle selected files
fileInput.addEventListener('change', (event) => {
	const files = event.target.files;
	// Process files here (e.g., upload or preview)
	console.log('Selected files:', files);
});



// on enter send the message 
document.getElementById('input').addEventListener('keydown', function(event) {
	if (event.key === 'Enter') {
		event.preventDefault(); // Prevent form submission or other default actions
		sendMessage();
	}
});



