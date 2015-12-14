//=================================================================================================================
//※ 보조 함수
//=================================================================================================================
//선로딩
	// 이미지 선로딩 (원본 출처 : http://stackoverflow.com/questions/8264528/image-preloader-javascript-that-supports-eventNames/8265310#8265310)
	function loadImages(arr,callBack){ 
		var imagesArray = [];
		var img;
		var remaining = arr.length;
		for (var i = 0; i < arr.length; i++) {
			img = new Image();
			img.onload = function() {
				//외부 처리
				var percent = Math.round((((arr.length - remaining + 1)/arr.length)*100),0).toString()+"%"
				$("#loading_bar").style.width = percent;
				$("#loading_num").innerHTML = percent;
				//내부 처리
				--remaining;
				if (remaining <= 0) {
					callBack();
				};
			};
			img.onerror = function() {
				//외부 처리 
				var percent = Math.round((((arr.length - remaining + 1)/arr.length)*100),0).toString()+"%"
				$("#loading_bar").style.width = percent;
				$("#loading_num").innerHTML = percent;
				--remaining;
				if (remaining <= 0) {
					callBack();
				};
			};
			img.src = arr[i];
			document.getElementById("imagePreloader").innerHTML += "<img src='" + arr[i] + "' />";
			imagesArray.push(img);
		};
	};


//DOM 관련
	//DOM 선택자
	function $(parameter) {
		return document.querySelector(parameter);
	}
	function $$(parameter) {
		return document.querySelectorAll(parameter);
	}


	//특정 클래스 추가/삭제
	function hasClass(ele,cls) {
	  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	}

	function addClass(ele,cls) {
	  if (!hasClass(ele,cls)) ele.className += " "+cls;
	}

	function removeClass(ele,cls) {
	  if (hasClass(ele,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	  }
	}



//수치 관련
	//천단위 콤마 표시 (출처 : http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript)
	function thousand(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};



//컨텐츠 관련
	//BGM 실행
	function bgm(name) {
		//A. sound가 켜져있을 때만 실행
		if (game["sound"] == 1) {
			
			//1. 이름 - "" : BGM 실행 정지
			if (name == "") {
				//1-1. BGM 정지
				audio_bgm.pause();
				audio_bgm.currentTime = 0;
			//2. 나머지 : 해당 '이름' bgm 실행
			} else {
				//1-1. BGM 정지
				audio_bgm.pause();
				audio_bgm.currentTime = 0;
				//1-2. 새 BGM 실행
				audio_bgm = track_bgm[name];
				audio_bgm.loop = true;
				audio_bgm.volume = 0.5;
				audio_bgm.play();
			}
			
		}
	}
	
	//사운드이펙트 실행
	function sfx(name, vol) {
		//A. sound가 켜져있을 때만 실행
		if (game["sound"] == 1) {
			
			//a. 이름 - "" : 모든 사운드이펙트 실행 정지
			if (name == "") {
				//1-1. 사운드이펙트 정지
				for (var key in soundList) {
					if (soundList.hasOwnProperty(key)) {
						for (var i=0;i<soundList[key].length;i++) {
							soundList[key][i].pause();
							soundList[key][i].currentTime = 0;
						}
					}
				}
			//b. 나머지 : 해당 "이름" 사운드이펙트 실행
			} else {
				//1. 사운드 볼륨 설정
				if (vol <= 1 && vol >= 0) {
					soundList[name][playList[name]].volume = vol;
				} else {
					soundList[name][playList[name]].volume = 0.5;
				}
				//1. "재생 회차"번째 사운드를 재생
				soundList[name][ playList[name] ].play();
				//2. "재생 회차" 증가
				playList[name] += 1;
				//3. ("재생 회차"가 sameAudio 이상이면) ? "재생 회차" = 0
				if (playList[name] >= sameAudio) {
					playList[name] = 0;
				}
			}
			
		}
	}
/**/
