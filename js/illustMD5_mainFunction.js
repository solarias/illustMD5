//=================================================================================================================
//※ 주 함수
//=================================================================================================================
		//=================================================================================================================
		//※ 1. 캐릭터 설정
		//=================================================================================================================
		//일러스트 입력 준비
		function setInput(num) {
			//1. 일러스트 감추기 & 대기 메세지 출력
			$("#input_image_img_" + num.toString()).style.visibility = "hidden";
			$("#input_image_notice_" + num.toString()).style.visibility = "visible";

			var file = $("#input_file_" + num.toString()).files[0];
			var imageType = /image.*/;

			if (file.type.match(imageType)) {
				var reader = new FileReader();

				reader.onload = function() {

					//2. 캐릭터 설정
					setCharacter(num, reader.result)
				}
				reader.readAsDataURL(file);
			} else {
				alert("※ 경고 : 지원되지 않는 파일입니다.");

				//3. 대기 메세지 감추기 & 일러스트 출력
				$("#input_image_notice_" + num.toString()).style.visibility = "hidden";
				$("#input_image_img_" + num.toString()).style.visibility = "visible";
				$("#battle_image_" + num.toString()).style.display = "block";
			}
		}
		//캐릭터 설정 (입력된 일러스트 기반)
		function setCharacter(num, source) {
			//2. 일러스트 교체
			$("#input_image_img_" + num.toString()).src = source;
			$("#battle_image_" + num.toString()).src = source;

			//3. MD5 문자열 추출 & 저장
			var code = md5(source.split(",")[1]);
			player[num]["code"] = code;

			//4. 초기 능력치 산출
			//체력
			player[num]["life_init"]
				= Math.floor(parseInt(code[0] + code[1], 16) / ( 255 / (game["stat"]["life_gap"]/game["stat"]["life_unit"]) ) ) * game["stat"]["life_unit"] + game["stat"]["life_min"];

			//공격력
			player[num]["atk_init"]
				= Math.floor(parseInt(code[2] + code[3], 16) /  ( 255 / (game["stat"]["atk_gap"]/game["stat"]["atk_unit"]) ) ) * game["stat"]["atk_unit"] + game["stat"]["atk_min"];
				//분노 증가 공격력 - 공격력의 1/2 (최소단위는 유지)
				player[num]["atk_rage"]
					= Math.floor(parseInt(code[4] + code[5], 16) /  ( 255 / ( (game["stat"]["atk_gap"] / 2) / game["stat"]["atk_unit"] ) ) ) * game["stat"]["atk_unit"] + (game["stat"]["atk_min"]/2);

			//방어력
			player[num]["def_init"]
				= Math.floor(parseInt(code[6] + code[7], 16) /  ( 255 / (game["stat"]["def_gap"] / game["stat"]["def_unit"]) ) ) * game["stat"]["def_unit"] + game["stat"]["def_min"];
				//분노 증가 방어력 - 방어력의 1/2 (최소단위는 유지)
				player[num]["def_rage"]
					= Math.floor(parseInt(code[8] + code[9], 16) /  ( 255 / ( ((game["stat"]["def_gap"])/2) / game["stat"]["def_unit"] ) ) ) * game["stat"]["def_unit"] + (game["stat"]["def_min"]/2);

			//최대 크리티컬 게이지
			player[num]["critical_init"]
				= Math.floor(parseInt(code[10] + code[11], 16) /  ( 255 / (game["stat"]["critical_gap"] / game["stat"]["critical_unit"]) ) ) * game["stat"]["critical_unit"] + game["stat"]["critical_min"];
				//크리티컬 대미지
				player[num]["critical_damage"]
					= Math.floor(parseInt(code[14] + code[15], 16) /  ( 255 / (game["stat"]["critical_damage_gap"] / game["stat"]["critical_damage_unit"]) ) ) * game["stat"]["critical_damage_unit"] + game["stat"]["critical_damage_min"];

			//속도
			player[num]["spd"]
				= Math.floor(parseInt(code[16] + code[17], 16) / 2.55);

			//4. 기타 능력치 변경
			player[num]["life_now"] = player[num]["life_init"];
			player[num]["atk_now"] = player[num]["atk_init"];
			player[num]["def_now"] = player[num]["def_init"];
			player[num]["critical_now"] = 0;

			player[num]["life_real"] = player[num]["life_init"];
			player[num]["atk_real"] = player[num]["atk_init"];
			player[num]["def_real"] = player[num]["def_init"];
			player[num]["critical_real"] = 0;


			//5. 능력치 수치 출력
				//5-1. 체력
				$("#battle_life_num_" + num.toString()).innerHTML = thousand(player[num]["life_real"]);;
				//5-2. 공격력
				$("#battle_stat_atk_" + num.toString()).innerHTML = thousand(player[num]["atk_real"]);
				//5-3. 방어력
				$("#battle_stat_def_" + num.toString()).innerHTML = thousand(player[num]["def_real"]);
				//5-4. 최대 크리티컬 게이지
				$("#battle_critical_progress_" + num.toString()).style.height = player[num]["critical_init"].toString() + "px";
				$("#battle_critical_" + num.toString()).style.height = (player[num]["critical_init"] + 48).toString() + "px";
				//5-5. 초기 크리티컬 게이지
				$("#battle_critical_bar_" + num.toString()).style.height
					= ((player[num]["critical_real"] / player[num]["critical_init"]) * 100).toString() + "%";
				//5-6. 크리티컬 대미지
				$("#battle_critical_damage_" + num.toString()).innerHTML = "x" + player[num]["critical_damage"].toString();
					//크리티컬 대미지가 정수일 경우 : ".0"을 추가
					if (player[num]["critical_damage"].toString().length == 1) {
						$("#battle_critical_damage_" + num.toString()).innerHTML += ".0";
					}


			//6. 대기 메세지 감추기 & 일러스트 출력
			$("#input_image_notice_" + num.toString()).style.visibility = "hidden";
			$("#input_image_img_" + num.toString()).style.visibility = "visible";
			$("#battle_image_" + num.toString()).style.display = "block";

			//7. 업로드 변수 (0이면) 1로 조절
			if (game["upload"][num] <= 0) {
				game["upload"][num] = 1;
			}

			//8. (이미지 둘 다 올렸으면) 시작 버튼 활성화
			if (game["upload"][1] >= 1 && game["upload"][2] >= 1) {
				$("#input_run").disabled = "";
			}
		}
		/**/


		//=================================================================================================================
		//※ 2. 전투 세팅
		//=================================================================================================================
		//전투 세팅
		function battle_ready(phase, first, step) {

			switch (phase) {
				case "open":
					//1. Step 0
					if (step == 0) {
						//1-1. 테마 설정
						if (game["theme_selected"] == "random") {
							//"random" 테마 : 랜덤으로 결정
							game["theme"] = themeList[Math.floor(Math.random() * themeList.length)];
						} else {
							game["theme"] = game["theme_selected"];
						}
						//각 이름마다 정해진 이미지 출력
						switch (game["theme"]) {
							case "seatrain":
								$("#frame_battle").style.backgroundImage = "url(http://cfile220.uf.daum.net/image/225CD83E562204AD04325D)"

								break;
							case "street":
								$("#frame_battle").style.backgroundImage = "url(http://cfile205.uf.daum.net/image/222F523E562204AF2E959C)"

								break;
							case "tower":
								$("#frame_battle").style.backgroundImage = "url(http://cfile216.uf.daum.net/image/2536753E562204B02651B9)"

								break;
							case "night":
								$("#frame_battle").style.backgroundImage = "url(http://cfile225.uf.daum.net/image/235E003E562204AD03A589)"

								break;
							case "forest":
								$("#frame_battle").style.backgroundImage = "url(http://cfile216.uf.daum.net/image/2523F43E562204AC3541A1)"

								break;
							case "bakal":
								$("#frame_battle").style.backgroundImage = "url(http://cfile214.uf.daum.net/image/212D153E562204AA2EE15B)"

								break;
						}
						//1-2. 턴 제한 표시
							//1-2-1. 턴 최대치 설정
							game["turn_remain"] = game["turn_set"];
							//1-2-2. 턴 수치 표시
							$("#battle_turn").innerHTML = game["turn_remain"];
						//1-3. 문 여는 BGM
						bgm("gate");
					}

					//2. 문 열기
					if (step < 400) {
						$("#battle_gate_1").style.left = ($("#battle_gate_1").offsetLeft - 10).toString() + "px";
						$("#battle_gate_2").style.left = ($("#battle_gate_2").offsetLeft + 10).toString() + "px";
						//다음 이벤트
						auto["event"] = requestTimeout(function() {
							battle_ready("open", first, step + 10);
						}, (1000/game["real_FPS"]) * 1 );
					} else {
						battle_ready("setting");
					}

					break;
				case "setting":
					//1. 테마 BGM 출력
					bgm(game["theme"]);

					//2. 턴 세팅 : "open" 단계에서 실시

					//3. 랜덤 시드 지정 (두 플레이어간의 랜덤이 "고정"됨)
					Math.seedrandom(player[1]["code"] + player[2]["code"]);

					//4. 대전 종료 버튼 활성화
						//a. 문구 변경
						$("#input_run").value = "대전 종료";
						//b. 재활성화
						$("#input_run").disabled = "";

					//5. 다음 단계
					battle_ready("flip", first, "ready");

					break;
				case "flip":
					//1. 카드 뒤집는 이펙트
					removeClass($("#battle_character_1"),"flipped");
					removeClass($("#battle_character_2"),"flipped");

					//2. 다음 이벤트
					auto["event"] = requestTimeout(function() {
						battle_ready("first", first);
					}, (1000/game["real_FPS"]) * 60 );

					break;
				case "first":
					//1. 선공 결정 - 속도가 빠른 쪽이 선공
					var first;
					if (player[1]["spd"] > player[2]["spd"]) {
						first = 1;
					} else if (player[2]["spd"] > player[1]["spd"]) {
						first = 2;
					} else {
						//1-1. 속도가 같을 경우 - 두 플레이어의 MD5 코드를 합쳐서 랜덤 처리
						first = Math.floor(Math.random() * 2) + 1;
					}

					//2. 속도 표시
					for (var i=1;i<=2;i++) {
						$("#battle_character_info_text_" + i.toString()).innerHTML = "속도";
						$("#battle_character_info_text_" + i.toString()).style.display = "block";
						$("#battle_character_info_num_" + i.toString()).innerHTML = player[i]["spd"].toString();
						$("#battle_character_info_num_" + i.toString()).style.display = "block";
					}

					//3. 선공 표시
					$("#battle_character_first_" + first.toString()).style.display = "block";

					//3. 다음 단계
					auto["event"] = requestTimeout(function() {
						//선공 표시 지움
						for (var i=1;i<=2;i++) {
							$("#battle_character_info_text_" + i.toString()).style.display = "none";
							$("#battle_character_info_num_" + i.toString()).style.display = "none";
							$("#battle_character_first_" + first.toString()).style.display = "none";
						}

						//이동
						battle_ready("sign", first, "ready");
					}, (1000/game["real_FPS"]) * 90 );

					break;
				case "sign":
					switch (step) {
						case "ready":
							//1. "ready" sfx 출력
							sfx("ready");

							//2. "ready" 사인 표시
							$("#battle_sign_ready").style.display = "block";

								//3. 처리
								auto["event"] = requestTimeout(function() {
									battle_ready("sign", first, "fight");
								}, (1000/game["real_FPS"]) * 60 )

							break;
						case "fight":
							//1. "fight" sfx 출력
							sfx("fight");

							//2. "ready" 사인 지우기
							$("#battle_sign_ready").style.display = "none";

							//3. "fight" 사인 표시
							$("#battle_sign_fight").style.display = "block";

								//다음 처리
								auto["event"] = requestTimeout(function() {
									//a. "fight" 사인 지우기
									$("#battle_sign_fight").style.display = "none";

									//b. 선공부터 전투 실행
									battle_standby(first, first, 0);
								}, (1000/game["real_FPS"]) * 60 )

							break
					}

					break;
			}
		}
		/**/



		//=================================================================================================================
		//※ 3. 전투 실시
		//=================================================================================================================
		//전투 - 준비 (남은 턴 & 대기 스킬 확인)
		function battle_standby(shot, action, phase) {
			//EX. 상대방 지정 변수
			hit = (shot == 1) ? 2 : 1;

			switch (phase) {
				//=============================================
				// ※ A. 분노 & 유리 깨짐 "이펙트" 종료여부 판단
				//=============================================
				case 0:
					//A-1. 이펙트가 끝났으면
					if (auto["player"][shot]["rage"] == null && auto["player"][shot]["particle"] == null) {
						//A-1-1. 다음번에 대기하지 않고 실행
						phase = 1;
					}
					//A-2. 1프레임 뒤 다시 대기여부 확인
					auto["event"] = requestTimeout(function() {
						battle_standby(shot, action, phase);
					}, (1000/game["real_FPS"]) * 1 );
					break;
				//=============================================
				// ※ B. 남은 턴 확인
				//=============================================
				case 1:
					//b-1. 남은 턴 표시
					$("#battle_turn").innerHTML = game["turn_remain"];
					//b-2. IF (남은 턴 > 0)
					if (game["turn_remain"] > 0) {
						//b-2-1. 턴 감소
						game["turn_remain"] -= 1;
						//b-2-2. 다음 진행
						auto["event"] = requestTimeout(function() {
							battle_standby(shot, action, 2);
						}, (1000/game["real_FPS"]) * 1 );
					//b-3. IF (남은 턴 = 0)
					} else if (game["turn_remain"] <= 0) {
						//b-4-1. 타임 오버
						battle_timeover();
					}

					break;
				case 2:
					//=============================================
					// ※ 3. 분노 발동 대기 초기화
					//=============================================
					//c. IF ("분노 발동 대기" 존재)
					if (player[shot]["rage_delay"] == 1) {
						//c-1. "분노 발동 대기" 제거
						player[shot]["rage_delay"] = 0;
					}
					//=============================================
					// ※ 4. 연타 여부 확인
					//=============================================
					//d. IF (공격 횟수가 0보다 작으면) ? 충전
					if (player[shot]["hit_remain"] <= 0) {
						player[shot]["hit_remain"] = player[shot]["combo"];
					}
					//e. 모션 시작
					battle_motion(action, "go", null);

					break;
			}
		}



		//전투 - 모션 {
		function battle_motion(shot, phase, speed) {
			//A. 공격자(shot) & 상대방(hit) 변수 지정
			var hit = (shot == 1) ? 2 : 1;
			//B. 공격자 속도 (없으면) 지정
			if (!speed) {
				speed = ( (player[shot]["rage"] + 3) / 3 ) * 30;
			}

			//D. 공격자(shot) 이동
			switch (shot) {
				//B-1. 플레이어 1
				case 1:
					//a. 플레이어 지정
					var $shooter = $("#battle_character_" + shot.toString());
					var $hitted =  $("#battle_character_" + hit.toString());

					switch (phase) {
						//b. "접근" 상태
						case "go":
							//b-1-1. 아직 접근 중
							if ($shooter.offsetLeft + $shooter.offsetWidth + speed < $hitted.offsetLeft) {
								//접근 개시
								$shooter.style.left = ($shooter.offsetLeft + speed).toString() + "px";
								//모션 재발동
								auto["event"] = requestTimeout(function() {
									battle_motion(shot, phase, speed);
								}, (1000/game["real_FPS"]) * 1 );
							//b-1-2. 다음번에 접근
							} else {
								//b-1-2-1. 접근 완료
								$shooter.style.left = ($hitted.offsetLeft - $shooter.offsetWidth).toString() + "px";

								//b-1-2-2. "타격" sfx 출력
								sfx("hit" + player[shot].rage);

								//b-1-2-3. 이펙트 발동
								battle_effect(hit, player[shot]["rage"], 1);

								//b-1-2-4. 공격 개시
								battle_hit(shot);

								//b-1-2-5. 복귀 실시
								auto["event"] = requestTimeout(function() {
									battle_motion(shot, "back", speed);
								}, (1000/game["real_FPS"]) * 1 );
							}

							break;
						//b. "복귀" 상태
						case "back":
							//아직 복귀 중
							if ($shooter.offsetLeft - speed > 80) {
								//접근 개시
								$shooter.style.left = ($shooter.offsetLeft - speed).toString() + "px";
								//모션 재발동
								auto["event"] = requestTimeout(function() {
									battle_motion(shot, phase, speed);
								}, (1000/game["real_FPS"]) * 1 );
							//다음 번에 복귀
							} else {
								//복귀 완료
								$shooter.style.left = (80).toString() + "px";
							}

							break;
					}

					break;
				//B-2. 플레이어 2
				case 2:
					//플레이어 지정
					var $shooter = $("#battle_character_" + shot.toString());
					var $hitted =  $("#battle_character_" + hit.toString());

					switch (phase) {
						//b. "접근" 상태
						case "go":
							//b-1-1. 아직 접근 중
							if ($shooter.offsetLeft - $shooter.offsetWidth - speed > $hitted.offsetLeft) {
								//접근 개시
								$shooter.style.left = ($shooter.offsetLeft - speed).toString() + "px";
								//모션 재발동
								auto["event"] = requestTimeout(function() {
									battle_motion(shot, phase, speed);
								}, (1000/game["real_FPS"]) * 1 );
							//b-1-2. 다음번에 접근
							} else {
								//b-1-2-1. 접근 완료
								$shooter.style.left = ($hitted.offsetLeft + $shooter.offsetWidth).toString() + "px";

								//b-1-2-2. 공격 개시
								battle_hit(shot);

								//b-1-2-3. 복귀 실시
								auto["event"] = requestTimeout(function() {
									battle_motion(shot, "back", speed);
								}, (1000/game["real_FPS"]) * 1 );
							}

							break;
						//b. "복귀" 상태
						case "back":
							//아직 복귀 중
							if (800 - ($shooter.offsetLeft + $shooter.offsetWidth) - speed > 80) {
								//접근 개시
								$shooter.style.left = ($shooter.offsetLeft + speed).toString() + "px";
								//모션 재발동
								auto["event"] = requestTimeout(function() {
									battle_motion(shot, phase, speed);
								}, (1000/game["real_FPS"]) * 1 );
							//다음 번에 복귀
							} else {
								//복귀 완료
								$shooter.style.left = (800 - 80 - $shooter.offsetWidth).toString() + "px";
							}


							break;
					}

					break;
			}
		}



		//전투 타격 이펙트 & 피격
		function battle_effect(hit, rage, phase) {
			//a. 플레이어, 이펙트 지정
			var $hitted = $("#battle_character_" + hit.toString());
			var $effect = $("#battle_effect_hit_" + hit.toString() + "_" + rage.toString());

			//b. 이동 간격 지정 (플레이어 위치에 따라 +/- 조절)
			switch (hit) {
				case 1:
					var movement = -10;

					break;
				case 2:
					var movement = 10;

					break;
			}

			//페이즈별 이펙트 상황
			switch (phase) {
				case 1://이펙트 1
					//모션
					$hitted.style.left = ($hitted.offsetLeft + movement).toString() + "px";
					//이펙트
					$effect.style.backgroundPosition = "0px 0px";
					$effect.style.display = "block"
					//다음 페이즈
					auto["player"][hit]["hit"] = requestTimeout(function() {
						battle_effect(hit, rage, phase + 1);
					}, (1000/game["real_FPS"]) * 4 );

					break;
				case 2://이펙트 1
					//모션
					$hitted.style.left = ($hitted.offsetLeft - movement).toString() + "px";
					//이펙트
					$effect.style.backgroundPosition = ((-$effect.offsetWidth - 1) * 1).toString() + "px 0px";
					//다음 페이즈
					auto["player"][hit]["hit"] = requestTimeout(function() {
						battle_effect(hit, rage, phase + 1);
					}, (1000/game["real_FPS"]) * 4 );

					break;
				case 3://이펙트 1
					//모션
					//이펙트
					$effect.style.backgroundPosition = ((-$effect.offsetWidth - 1) * 2).toString() + "px 0px";
					//다음 페이즈
					auto["player"][hit]["hit"] = requestTimeout(function() {
						battle_effect(hit, rage, phase + 1);
					}, (1000/game["real_FPS"]) * 4 );

					break;
				case 4://이펙트 복구
					//모션
					//이펙트
					$effect.style.backgroundPosition =  "0px 0px";
					$effect.style.display = "none"

					break;
			}
		}



		//전투 - 타격
		function battle_hit(shot) {
			//A. 공격자(shot) & 상대방(hit) 변수 지정
			var hit = (shot == 1) ? 2 : 1;

			//B-1. 크리티컬 여부 계산
			var setCritical = Math.random() < player[shot]["critical_now"] / player[shot]["critical_init"];
			//B-2. 크리티컬 공격 시
			if (player[shot]["critical_now"] >= player[shot]["critical_init"]) {
				//a-1. 크리티컬 여부 기억
				var cri = 1;
				//a-2. "크리티컬" sfx 출력
				sfx("critical");
				sfx("hit" + player[shot].rage);
				//a-3. 공격력 증폭량 = 크리티컬
				var add = player[shot]["critical_damage"];
				//a-4. 크리티컬 효과 표시
					//a-4-1. 대미지 글씨 크기 확대
					addClass($("#battle_damage_" + hit.toString()),"critical");
					//a-4-2. 크리티컬 글씨 출력
					addClass($("#battle_effect_critical_" + hit.toString()),"appear");
					$("#battle_effect_critical_" + hit.toString()).style.display = "block";
				//a-5. "공격자" 크리티컬 게이지 초기화
				player[shot]["critical_now"] = 0;
				//a-6. "공격자" 크리티컬 게이지 (빠르게) 갱신
				battle_update(shot, "critical", 10, null)
			//B-3. 일반 공격 시
			} else {
				//b-1. "타격" sfx 출력
				sfx("hit" + player[shot].rage);
				//b-2. 공격력 증폭량 = 1
				var add = 1;
				//b-3. "공격자" 크리티컬 게이지 증가
				player[shot]["critical_now"] += 10;
				//b-4. "공격자" 크리티컬 게이지 (빠르게) 갱신
				battle_update(shot, "critical", 10, null)
			}

			//C. 공통 처리 (크리티컬 or NOT)
				//a. 타격 이펙트 발동
				battle_effect(hit, player[shot]["rage"], 1);
				//b. 피해수치 계산 (공격력 증폭량 포함/ 최소 단위 : 10, 최소 피해량 : 10)
				var damage = Math.max(10, parseInt((player[shot]["atk_now"]* add / 10) * 10 - player[hit]["def_now"]) );
				//c. 피해수치 표시
				battle_damage(hit, damage, 1);
				//d. 피해수치만큼 체력 감소
				player[hit]["life_now"] -= damage;
				//e. "방어자" 크리티컬 게이지 증가
				player[hit]["critical_now"] += 40 * (1 + (damage/player[hit]["life_init"]) * 2);
				//e. "방어자" 크리티컬 게이지 (빠르게) 갱신
				battle_update(hit, "critical", 10, null)

				//etc. 타격 이펙트 강화 (옵션 활성화 상태에서만)
				if ($("#input_option_effect").checked) {
					//etc1. 화면 충격 이펙트 (분노 1단계 이상)
					if (player[shot].rage >= 1) {
						$("#frame_battle").style.webkitFilter = "brightness(3) blur(20px)";
						$("#frame_battle").style.filter = "brightness(3) blur(20px)";
						requestTimeout(function() {
							$("#frame_battle").style.webkitFilter = "brightness(1)";
							$("#frame_battle").style.filter = "brightness(1)";
						},10*(player[shot].rage+1));
					}
					//etc2. 상시 유리깨짐 이펙트 (분노 3단계 이상)
					if (player[shot].rage >= 3) {
						battle_particle(hit, null, 1);
					}
				}


			//D. 공격자 공격횟수 1 차감
			player[shot]["hit_remain"] -= 1;
			//E. 후속조치
				//E-1. IF (피가 1 이상)
				if (player[hit]["life_now"] > 0) {
					//a. IF (남은 공격 횟수 > 0)
					if (player[shot]["hit_remain"] > 0) {
						//a-1. 체력 최신화, 이후 다시 공격
						battle_update(hit, "life", null, function() {battle_motion(shot, "go", null);});
					//b. ELSE (공격 횟수 = 0)
					} else {
						//체력 최신화, 이후 턴 넘기기 (다시 준비)
						battle_update(hit, "life", null, function() {battle_standby(hit, hit, 0);});
					}
				//E-2. ELSE (피가 0)
				} else {
					//체력 최신화, 이후 전투 종료
					battle_update(hit, "life", null, function() {battle_finish(shot, hit, 1)});
				}
		}



		//전투 - 피해수치 표시
		function battle_damage(hit, damage, phase) {
			//a. 기존 피해 수치 연속실행 중단 (중첩 방지)
			clearRequestTimeout(auto["player"][hit]["damage"]);

			//b. 피해 이펙트 선정
			$effect = $("#battle_damage_" + hit.toString());

			//c. 피해 수치 가시화
			switch (phase) {
				//c-1. 페이즈 1
				case 1:
					//c-1-1. 피해수치 적용
					$effect.innerHTML = thousand(damage);
					//c-1-2. 색상(흰색) 적용
					addClass($effect,"appear");
					//c-1-3. 글자 가시화
					$effect.style.display = "block";
						//다음 페이즈
						auto["player"][hit]["damage"] = requestTimeout(function() {
							battle_damage(hit, damage, phase + 1);
						}, (1000/game["real_FPS"]) * 4 );

					break;
				//c-2. 페이즈 2
				case 2:
					//c-2-1. 색상(노랑) 적용
					removeClass($effect,"appear");
					//c-2-2. 크리티컬 히트 색상 복구
					removeClass($("#battle_effect_critical_" + hit.toString()),"appear");
						//다음 페이즈
						auto["player"][hit]["damage"] = requestTimeout(function() {
							battle_damage(hit, damage, phase + 1);
						}, (1000/game["real_FPS"]) * 25 );

					break;
				//c-3. 마지막 페이즈 (소멸)
				case 3:
					//c-3-1. 글자 비가시화
					$effect.style.display = "none";
					//c-3-2. 글씨 관련 클래스 초기화
					$effect.className = "battle_damage";
					//c-3-3. 크리티컬 히트 비가시화
					$("#battle_effect_critical_" + hit.toString()).style.display = "none";
					//연속 실행 = null (중지됨을 판단하기 위해)
					auto["player"][hit]["damage"] = null;

					break;
			}
		}



		//전투 - 특정 능력치 최신화 ("게임 속도"의 영향을 받음)
		function battle_update(target, stat, gap, callback) {
			//1. 기존 최신화 연속실행 비활성화 (중첩 방지)
			clearRequestTimeout(auto["player"][target][stat]);

			//2. 간격 설정 (최초 업데이트 시) (최소 간격 : 1)
			if (!gap) {
				var len = Math.floor(Math.abs( (player[target][stat + "_now"] - player[target][stat + "_real"]) / 15 ));
				gap = Math.max(1, len);
			}

			//3. 시각처리 최신화 함수 (반복 사용을 위해)
			function visualize(vary) {
				switch (stat) {
					//체력
					case "life":
						$("#battle_life_num_" + target.toString()).innerHTML = thousand(player[target]["life_real"]);
						$("#battle_life_bar_" + target.toString()).style.width = ((player[target]["life_real"] / player[target]["life_init"]) * 100).toString() + "%";

						//체력 한정 - 수치가 "0"인가 ? 비시각화 : 시각화
						if (player[target]["life_real"] == 0) {
							$("#battle_life_bar_" + target.toString()).style.display = "none";
						} else {
							$("#battle_life_bar_" + target.toString()).style.display = "block";
						}

						break;
					//공격력
					case "atk":
						$("#battle_stat_atk_" + target.toString()).innerHTML = "\
							<span class='stat_" + vary + "'>" + thousand(player[target]["atk_real"]) + "</span>";

						break;
					//방어력
					case "def":
						$("#battle_stat_def_" + target.toString()).innerHTML = "\
							<span class='stat_" + vary + "'>" + thousand(player[target]["def_real"]) + "</span>";

						break;
					//크리티컬
					case "critical":
						$("#battle_critical_bar_" + target.toString()).style.height
							= ((player[target]["critical_real"] / player[target]["critical_init"]) * 100).toString() + "%";

						//크리티컬 한정 - vary가 "max"인가 ? 빨간 색 : 주황색
						if (vary == "max") {
							addClass($("#battle_critical_bar_" + target.toString()),"max");
						} else {
							removeClass($("#battle_critical_bar_" + target.toString()),"max");
						}
						break;
				}
			}

			//4. 작동 개시 (수치가 차이가 날 경우)
			if (player[target][stat + "_real"] != player[target][stat + "_now"]) {
				//a. 실제 수치보다 높으면 ?
				if (player[target][stat + "_real"] > player[target][stat + "_now"]) {
					//a-1. [체력 한정] IF (실제 체력이 gap보다 작으면) ?
					if ( (stat == "life") && (player[target]["life_real"] < gap) ) {
						//a-1-1. IF (현재 체력이 0보다 작거나 같으면) ?
						if (player[target]["life_now"] <= 0) {
							//ㄱ. (현재, 실제 모두) 0으로 맞춰줌
							player[target][stat + "_now"] = 0;
							player[target][stat + "_real"] = 0;
							//ㄴ. 시각 처리 최신화
							visualize("set");
							//ㄷ. 완전히 깨진 ("finish") 유리 & 이펙트 표시
							battle_particle(target, "finish", 1);
							//ㄹ. 후속 조치
							if (callback) {
								callback();
							}
						//a-1-2. If (현재 체력이 0보다 크면) ?
						} else {
							//ㄱ. 수치 변경
							player[target][stat + "_real"] = player[target][stat + "_now"];
							//ㄴ. 시각처리 최신화
							visualize("set");
							//ㄷ. (체력 한정) 분노 조건 달성 ? 유리 깨짐 이펙트
							if (stat == "life") {
								if ( (player[target]["life_real"] / player[target]["life_init"]) * 100 <= game["rage"][player[target]["rage"] + 1] ) {
									//분노 발동
									battle_rage(target, 1);
									//깨진 유리 표시 & 이펙트 발동
									battle_particle(target, null, 1);
								}
							}
							//ㄹ. 후속 조치
							if (callback) {
								callback();
							}
						}
					//a-2. gap보다 간격이 크면 ?
					} else if (player[target][stat + "_real"] - gap > player[target][stat + "_now"]) {
						//a-2-1. 수치 변경
						player[target][stat + "_real"] -= gap;
						//a-2-2. 시각처리 최신화
						visualize("down");
						//a-2-3. (체력 한정) 분노 조건 달성 ? 유리 깨짐 이펙트
						if (stat == "life") {
							if ( (player[target]["life_real"] / player[target]["life_init"]) * 100 <= game["rage"][player[target]["rage"] + 1] ) {
								//분노 발동
								battle_rage(target, 1);
								//깨진 유리 표시 & 이펙트 발동
								battle_particle(target, null, 1);
							}
						}
						//a-2-4. 재실행
						auto["player"][target][stat] = requestTimeout(function() {
							battle_update(target, stat, gap, callback);
						}, (1000/game["real_FPS"]) * 1 );
					//a-3. gap보다 간격이 작거나 같으면 ? (최신화 완료 시)
					} else {
						//a-3-1. 수치 변경
						player[target][stat + "_real"] = player[target][stat + "_now"];
						//a-3-2. 시각처리 최신화
						visualize("set");
						//a-3-3. (체력 한정) 분노 조건 달성 ? 유리 깨짐 이펙트
						if (stat == "life") {
							if ( (player[target]["life_real"] / player[target]["life_init"]) * 100 <= game["rage"][player[target]["rage"] + 1] ) {
								//분노 발동
								battle_rage(target, 1);
								//깨진 유리 표시 & 이펙트 발동
								battle_particle(target, null, 1);
							}
						}
						//a-3-4. 후속 조치
						if (callback) {
							callback();
						}
					}
				//b. 실제 수치보다 낮으면 ?
				} else if (player[target][stat + "_real"] < player[target][stat + "_now"]) {
					//b-1. (크리티컬 한정) IF ("실제 크리티컬" + gap이 최대 크리티컬 이상)
					if ( (stat == "critical") && (player[target]["critical_real"] + gap >= player[target]["critical_init"]) ) {
						//b-1-1. (현재, 실제 모두) "최대치로" 수치 변경
						player[target][stat + "_now"] = player[target]["critical_init"];
						player[target][stat + "_real"] = player[target]["critical_init"];
						//b-1-2. 시각 처리 최신화
						visualize("max");
						//b-1-3. 후속 조치
						if (callback) {
							callback();
						}
					//b-1. gap보다 간격이 크면 ?
					} else if (player[target][stat + "_real"] + gap < player[target][stat + "_now"]) {
					//b-1-1. 수치 변경
					player[target][stat + "_real"] += gap;
					//b-1-2. 시각처리 최신화
					visualize("up");
					//b-1-3. 재실행
					auto["player"][target][stat] = requestTimeout(function() {
						battle_update(target, stat, gap, callback);
					}, (1000/game["real_FPS"]) * 1 );
					//b-2. gap보다 간격이 작거나 같으면 ?  (최신화 완료 시)
					} else {
						//b-2-1. 수치 변경
						player[target][stat + "_real"] = player[target][stat + "_now"];
						//b-2-2. 시각처리 최신화
						visualize("set");
						//b-2-3. 후속 조치
						if (callback) {
							callback;
						}
					}
				}
			}
		}


		//전투 - 분노 발동 ("게임 속도"의 영향을 받음)
		function battle_rage (hit, step) {
			//EX. 기존 이펙트 연속실행 중단 (중첩 방지)
			clearRequestTimeout(auto["player"][hit]["rage"]);

			//A. 최초 - 수치 변경
			if (step == 1) {
				//A-1. "분노" sfx 출력
				sfx("rage");

				//A-2. 분노 효과 발동
					//A-2-1. 수치 변경
					player[hit]["rage"] += 1;
					player[hit]["atk_now"] += player[hit]["atk_rage"];
					player[hit]["def_now"] += player[hit]["def_rage"];
					//A-2-2. 시각화
						//a. 라이프 바 & 체력 수치 & 색상
						$("#battle_life_bar_" + hit.toString()).className = "battle_life_bar" + " " + "rage_" + player[hit]["rage"].toString();
						$("#battle_life_num_" + hit.toString()).className = "battle_life_num" + " " + "rage_" + player[hit]["rage"].toString();
						//b. 분노 레벨 수치
						$("#battle_stat_rage_" + hit.toString()).innerHTML = player[hit]["rage"].toString();
						//c. 공격력 수치
						battle_update(hit,"atk");
						//방어력 수치
						battle_update(hit,"def");
					//A-2-3. 분노 발동 대기
					player[hit]["rage_delay"] += 1;
			}
			//B 단계별 분노 이펙트
			if (step == 1) {
				//B-0. 분노 이펙트 준비
				$("#battle_buff_" + hit.toString()).style.opacity = "0";
					//다음 스텝
					auto["player"][hit]["rage"] = requestTimeout(function() {
						battle_rage(hit, step + 1);
					}, (1000/game["real_FPS"]) * 2 );
			} else if (step > 1 && step < 5) {
				//B-1. 분노 이펙트 생성
				$("#battle_buff_" + hit.toString()).style.opacity = (parseFloat($("#battle_buff_" + hit.toString()).style.opacity) + 0.2).toString();
					//다음 스텝
					auto["player"][hit]["rage"] = requestTimeout(function() {
						battle_rage(hit, step + 1);
					}, (1000/game["real_FPS"]) * 2 );
			} else if (step >= 5 && step < 7) {
				//B-2. 분노 이펙트 유지
				$("#battle_buff_" + hit.toString()).style.opacity = "1";
					//다음 스텝
					auto["player"][hit]["rage"] = requestTimeout(function() {
						battle_rage(hit, step + 1);
					}, (1000/game["real_FPS"]) * 2 );
			} else if (step >= 7 && step < 12) {
				//B-3. 분노 이펙트 제거
				$("#battle_buff_" + hit.toString()).style.opacity = (parseFloat($("#battle_buff_" + hit.toString()).style.opacity) - 0.2).toString();
					//다음 스텝
					auto["player"][hit]["rage"] = requestTimeout(function() {
						battle_rage(hit, step + 1);
					}, (1000/game["real_FPS"]) * 2 );
			} else if (step >= 12) {
				//B-4. 분노 종료
				$("#battle_buff_" + hit.toString()).style.opacity = "0";
				//B-5. 연속 실행 = null (중단됨을 판단하기 위해)
				auto["player"][hit]["rage"] = null;
			}

		}

		//전투 - 유리 깨짐 이펙트 ("게임 속도"의 영향을 받음)
		function battle_particle(hit, type, phase) {
			//a. 기존 이펙트 연속실행 중단 (중첩 방지)
			clearRequestTimeout(auto["player"][hit]["particle"]);

			//b. 유리, 이펙트 지정
			$glass = $("#battle_glass_" + hit.toString());
			$effect = $("#battle_effect_particle_" + hit.toString());

			//c. 깨진 유리창 종류 결정
			if (type == "finish") {
				typeNum = 3;
			} else {
				typeNum = player[hit]["rage"] - 1;
			}

			//c. (페이즈 1 한정) 깨진 유리 표시
			if (phase == 1) {
				$glass.style.backgroundPosition = ( -($glass.offsetWidth + 1) * typeNum ).toString() + "px 0px";
				$glass.style.visibility = "visible";
			}

			//d. 페이즈별 이펙트
			switch (phase) {
				//페이즈 1
				case 1:
					//"유리 깨짐" sfx 출력
					sfx("particle");

					//이펙트
					$effect.style.backgroundPosition = "0px 0px";
					$effect.style.display = "block"
					//다음 페이즈
					auto["player"][hit]["particle"] = requestTimeout(function() {
						battle_particle(hit, typeNum, phase + 1);
					}, (1000/game["real_FPS"]) * 4 );

					break;
				//페이즈 2
				case 2:
					//이펙트
					$effect.style.backgroundPosition = ((-$effect.offsetWidth - 1) * 1).toString() + "px 0px";
					//다음 페이즈
					auto["player"][hit]["particle"] = requestTimeout(function() {
						battle_particle(hit, typeNum, phase + 1);
					}, (1000/game["real_FPS"]) * 4 );

					break;
				//페이즈 3
				case 3:
					//이펙트
					$effect.style.backgroundPosition = ((-$effect.offsetWidth - 1) * 2).toString() + "px 0px";
					//다음 페이즈
					auto["player"][hit]["particle"] = requestTimeout(function() {
						battle_particle(hit, typeNum, phase + 1);
					}, (1000/game["real_FPS"]) * 4 );

					break;
				//페이즈 4
				case 4:
					//이펙트
					$effect.style.backgroundPosition = ((-$effect.offsetWidth - 1) * 3).toString() + "px 0px";
					//다음 페이즈
					auto["player"][hit]["particle"] = requestTimeout(function() {
						battle_particle(hit, typeNum, phase + 1);
					}, (1000/game["real_FPS"]) * 4 );

					break;
				//페이즈 5
				case 5:
					//이펙트
					$effect.style.backgroundPosition = ((-$effect.offsetWidth - 1) * 4).toString() + "px 0px";
					//다음 페이즈
					auto["player"][hit]["particle"] = requestTimeout(function() {
						battle_particle(hit, typeNum, phase + 1);
					}, (1000/game["real_FPS"]) * 4 );

					break;
				//종료 페이즈
				case 6:
					//이펙트 복구 & 비활성화
					$effect.style.backgroundPosition = "0px 0px";
					$effect.style.display = "none";
					//연속 실행 = null (중단됨을 판단하기 위해)
					auto["player"][hit]["particle"] = null;

					break;
			}
		}
		/**/



		//=================================================================================================================
		//※ 4. 전투 마무리
		//=================================================================================================================
		//전투 - 타임오버 (체력 잔량 확인)
		function battle_timeover() {
			//a. "타임오버 문구" 표시
			$("#battle_sign_timeover").style.display = "block";

			//b. 체력 잔량 "%"로 계산
			var p1_remain = parseInt((player[1]["life_real"] / player[1]["life_init"]) * 1000) / 10;
			var p2_remain = parseInt((player[2]["life_real"] / player[2]["life_init"]) * 1000) / 10;
			//c. 체력 잔량 "안내 표시"
			$("#battle_character_info_text_1").innerHTML = "남은 체력";
			$("#battle_character_info_text_2").innerHTML = "남은 체력";
			$("#battle_character_info_text_1").style.display = "block";
			$("#battle_character_info_text_2").style.display = "block";
			//d. 체력 잔량 표시
			$("#battle_character_info_num_1").innerHTML = p1_remain.toString() + "%";
			$("#battle_character_info_num_2").innerHTML = p2_remain.toString() + "%";
			$("#battle_character_info_num_1").style.display = "block";
			$("#battle_character_info_num_2").style.display = "block";

			//d. IF (플레이어 1 체력이 더 많음 (%))
			if ( p1_remain > p2_remain ) {
				//플레이어 1 승리
				auto["event"] = requestTimeout(function() {
					battle_finish(1, 2, 1);
				}, (1000/game["real_FPS"]) * 60 );

			//e. IF (플레이어 2 체력이 더 많음 (%))
			} else if ( p1_remain < p2_remain ) {
				//플레이어 2 승리
				auto["event"] = requestTimeout(function() {
					battle_finish(2, 1, 1);
				}, (1000/game["real_FPS"]) * 60 );

			//f. ELSE (비김)
			} else {
				//무승부
				auto["event"] = requestTimeout(function() {
					battle_finish(0, 0);
				}, (1000/game["real_FPS"]) * 60 );

			}
		}

		//전투 - 마무리
		function battle_finish(shot, hit, phase, step) {
			//A. 무승부
			if (shot == 0 && hit == 0) {
				//1. "TIME OVER" 문구 제거 (timeover 대비용)
				$("#battle_sign_timeover").style.display = "none";

				//2. (0.2초 후) "무승부" 문구 표시
				auto["event"] = requestTimeout(function() {
					$("#battle_sign_draw").style.display = "block";
				}, (1000/game["real_FPS"]) * 16 );


			} else {

				//B. 그 외 (비기지 않음)
				switch (phase) {
					//페이즈 1 : 패배 효과 & 타이머 종료
					case 1:
						//※ step이 없으면 1로 지정
						if (!step) {
							step = 1;
						}
						//스텝별로 다른 이벤트 발생
						switch (step) {
							//step 1
							case 1:
								//a. "패배" sfx 출력
								sfx("loose");
								//b. 게임 종료 상태 기억 (타이머 종료)
								game["end"] = 1;
								//c. 패배 캐릭터 투명도 표시 (="1")
								$("#battle_image_" + hit.toString()).style.opacity = "1";

							//step 1~9
							default:
								//a. 패배 캐릭터 서서히 사라짐
								$("#battle_image_" + hit.toString()).style.opacity = (parseFloat($("#battle_image_" + hit.toString()).style.opacity) - 0.1).toString();
								//b. 다음 스텝
								auto["event"] = requestTimeout(function() {
									battle_finish(shot, hit, 1, step + 1);
								}, (1000/game["real_FPS"]) * 9 );

								break;
							//step 10
							case 10:
								//a. 패배 캐릭터 없어짐
								$("#battle_image_" + hit.toString()).style.display = "none";
								$("#battle_image_" + hit.toString()).style.opacity = "1";
								//b. 다음 페이즈
								battle_finish(shot, hit, 2);

								break;
						}



						break;
					//페이즈 2 : 승리 효과
					case 2:
						//a. "승리" sfx 출력
						sfx("victory");

						//b. "TIME OVER" 문구 제거 (timeover 대비용)
						$("#battle_sign_timeover").style.display = "none";

						//c. 승리 문구 표시
						$("#battle_sign_win_" + shot.toString()).style.display = "block";

						break;
				}

			}
		}
		/**/





		//=================================================================================================================
		//※ 5. 종료
		//=================================================================================================================
		//전투 - 종료
		function battle_end(phase, step) {
			//A. 페이즈, 스텝 설정
			if (!phase) {
				phase = "ready";
			}

			switch (phase) {
				//B. 버튼 설정
				case "ready":
					//B-1. 버튼 문구 변경 & 비활성화
						//a. 문구 변경
						$("#input_run").value = "종료 중...";
						//b. 버튼 비활성화
						$("#input_run").disabled = "disabled";

					//B-2. 다음 이벤트
					auto["end"] = requestTimeout(function() {
						battle_end("close", 400);
					}, (1000/game["real_FPS"]) * 1 );

					break;
				//C. 문 닫기
				case "close":
					//C-1. 문 서서히 닫기
					if (step - 30 > 0) {
						$("#battle_gate_1").style.left = ($("#battle_gate_1").offsetLeft + 30).toString() + "px";
						$("#battle_gate_2").style.left = ($("#battle_gate_2").offsetLeft - 30).toString() + "px";
						//C-2. 다음 이벤트
						auto["end"] = requestTimeout(function() {
							battle_end("close", step - 30);
						}, (1000/game["real_FPS"]) * 1 );
					} else {
						//D-1. 문 맞추기
						$("#battle_gate_1").style.left = "0px";
						$("#battle_gate_2").style.left = "400px";
						//D-2. 다음 이벤트
						battle_end("endEvent");
					}

					break;
				//D. 이벤트 종료
				case "endEvent":
					//D-1. BGM 종료
					bgm("");
					//D-2. 모든 사운드이펙트 종료
					sfx("");
					//D-3. 문 닫는 소리
					sfx("close");

					//D-4. 모든 이벤트 종료
					clearRequestTimeout(auto["event"]);
					auto["event"] = null;
					for (var i = 1;i <= 2;i++) {
						for (var key in auto["player"][i]) {
							if (auto["player"].hasOwnProperty(key)) {
								clearRequestTimeout(auto["player"][i]["key"]);
								auto["player"][i]["key"] = null;
							}
						}
					}

					//D-4. 다음 이벤트
					battle_end("resetVariable");

					break;
				//E. 변수 초기화
				case "resetVariable":
					for (var i = 1;i <= 2;i++) {
						//E-1. 캐릭터 능력치
							//a. 수치
								//a-1. 현재 능력치
								player[i]["life_now"] = player[i]["life_init"];//체력
								player[i]["atk_now"] = player[i]["atk_init"];//공격력
								player[i]["def_now"] = player[i]["def_init"];//방어력
								player[i]["critical_now"] = 0;//크리티컬
								//a-2. 실제 능력치
								player[i]["life_real"] = player[i]["life_init"];//체력
								player[i]["atk_real"] = player[i]["atk_init"];//공격력
								player[i]["def_real"] = player[i]["def_init"];//방어력
								player[i]["critical_real"] = 0;//크리티컬
								//a-3. 단일 능력치
								player[i]["rage"] = 0;//분노 레벨
							//b. 표시사항
								//b-1. 체력
									//b-1-1. 라이프 바
									$("#battle_life_bar_" + i.toString()).className = "battle_life_bar";
									$("#battle_life_bar_" + i.toString()).style.width = "100%";
									$("#battle_life_bar_" + i.toString()).style.display = "block";//(라이프가 0이 되면 감춰둠)
									//b-1-2. 체력 수치
									$("#battle_life_num_" + i.toString()).className = "battle_life_num";
									$("#battle_life_num_" + i.toString()).innerHTML = thousand(player[i]["life_init"]);
								//b-2. 공격력
								$("#battle_stat_atk_" + i.toString()).innerHTML = thousand(player[i]["atk_init"]);
								//b-3. 방어력
								$("#battle_stat_def_" + i.toString()).innerHTML = thousand(player[i]["def_init"]);
								//b-4. 분노 레벨
								$("#battle_stat_rage_" + i.toString()).innerHTML = player[i]["rage"].toString();
								//b-5. 크리티컬
								removeClass($("#battle_critical_bar_" + i.toString()),"max");
								$("#battle_critical_bar_" + i.toString()).style.height = "0%";
						//E-2. 캐릭터 이미지, 이펙트
							//a. 캐릭터 이미지
							$("#battle_image_" + i.toString()).opacity = "1";
							$("#battle_image_" + i.toString()).style.display = "block";
							//b. 캐릭터 유리
							$("#battle_glass_" + i.toString()).style.backgroundPosition = "0px 0px";
							$("#battle_glass_" + i.toString()).style.visibility = "hidden";
							//c. 캐릭터 분노
							$("#battle_buff_" + i.toString()).opacity = "0";

							//d. 캐릭터 선공 표시
							$("#battle_character_first_" + i.toString()).style.display = "none";
							//e. 캐릭터 수치 안내
							$("#battle_character_info_text_" + i.toString()).innerHTML = "";
							$("#battle_character_info_text_" + i.toString()).style.display = "none";
							//f. 캐릭터 수치 정보
							$("#battle_character_info_num_" + i.toString()).innerHTML = "";
							$("#battle_character_info_num_" + i.toString()).style.display = "none";

							//이펙트 - 히트
							$("#battle_effect_hit_" + i.toString() + "_0").style.backgroundPosition = "0px 0px";
							$("#battle_effect_hit_" + i.toString() + "_0").style.display = "none";
							$("#battle_effect_hit_" + i.toString() + "_1").style.backgroundPosition = "0px 0px";
							$("#battle_effect_hit_" + i.toString() + "_1").style.display = "none";
							$("#battle_effect_hit_" + i.toString() + "_2").style.backgroundPosition = "0px 0px";
							$("#battle_effect_hit_" + i.toString() + "_2").style.display = "none";
							$("#battle_effect_hit_" + i.toString() + "_3").style.backgroundPosition = "0px 0px";
							$("#battle_effect_hit_" + i.toString() + "_3").style.display = "none";
							//이펙트 - 유리조각
							$("#battle_effect_particle_" + i.toString()).style.backgroundPosition = "0px 0px";
							$("#battle_effect_particle_" + i.toString()).style.display = "none";
							//이펙트 - 대미지
							$("#battle_damage_" + i.toString()).innerHTML = "";
							removeClass($("#battle_damage_" + i.toString()),"appear");
							removeClass($("#battle_damage_" + i.toString()),"critical");
							$("#battle_damage_" + i.toString()).style.display = "";
							//이펙트 - 크리티컬
							removeClass($("#battle_effect_critical_" + i.toString()),"appear");
							$("#battle_effect_critical_" + i.toString()).style.display = "";
						//E-3. 그 외 캐릭터 관련
							//a. 캐릭터 위치
							switch (i) {
								case 1:
									$("#battle_character_" + i.toString()).style.left = (80).toString() + "px";

									break;
								case 2:
									$("#battle_character_" + i.toString()).style.left = (800 - 80 - $("#battle_character_" + i.toString()).offsetWidth).toString() + "px";

									break;
							}
							//b. 캐릭터 뒷면 표시
							addClass($("#battle_character_" + i.toString()), "flipped");
							//c. 문구 - win
							$("#battle_sign_win_" + i.toString()).style.display = "";
					}
					//E-4. 기타
						//a. 문구 - ready
						$("#battle_sign_ready").style.display = "";
						//b. 문구 - fight
						$("#battle_sign_fight").style.display = "";
						//c. 문구 - time over
						$("#battle_sign_timeover").style.display = "";
						//d. 문구 - draw game
						$("#battle_sign_draw").style.display = "";

						//e. 턴 표시
						$("#battle_turn").innerHTML = game["turn_set"];

						//f. 랜덤 시드
						Math.seedrandom();
						//g. 게임 상태
						game["end"] = 0;
					//E-5. 다음 이벤트
					battle_end("complete");

					break;
				//F. 마무리
				case "complete":
					//a. 각종 버튼 복구
						//a-1. frame_input 내 input, select button 모두 활성화
						var controlList = $$("#frame_input input, #frame_input button, #frame_input select")
						for (var i = 0;i < controlList.length;i++) {
							controlList[i].disabled = "";
						}
						//a-2. "대전 종료" 버튼 설정
							//a. '리셋' 색상 제거
							removeClass($("#input_run"),"reset");
							//b. 문구 변경
							$("#input_run").value = "대전 시작";
							//c. 클릭 이벤트 변경
							$("#input_run").onclick = function() {
								run();
							}

					//b. 도움말 표시
					$("#frame_help").style.display = "block";

					break;
			}
		}
		/**/
