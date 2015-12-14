//=================================================================================================================
//※ 변수
//=================================================================================================================
//게임 정보
var game = {
	//초기 정보
	theme_selected : "random",//테마 (배경화면 & BGM)
	theme : "",//테마 (배경화면 & BGM)
	sound : 1,//사운드 출력여부 (-1 : 미지원, 0 : OFF, 1: ON)
	speed : 1,//게임 속도 (기본 속도 : 1)
	FPS : 60,//FPS
		//
		get real_FPS () {//변형된 FPS (게임속도 * FPS)
			return this["FPS"] * this["speed"];
		},
	turn_set : 40,//전투 턴 (세팅)
	turn_remain : 0,//전투 턴 (남음)
	upload : [//각 플레이어 업로드 여부
		"",//더미
		0,//플레이어 1
		0//플레이어 2
	],
	
	//전투 관련 정보
	rage : [//분노 단계별 발동 조건 ("%")
		100,//초기
		90,//1단계
		70,//2단계
		40//3단계
	],
	stat : {//능력치 세팅
		life_max : 30000,
		life_min : 5000,
			get life_gap () {
				return this["life_max"] - this["life_min"];
			},
		life_unit : 100,
		
		atk_max : 2000,
		atk_min : 500,
			get atk_gap () {
				return this["atk_max"] - this["atk_min"];
			},
		atk_unit : 10,
		
		def_max : 1000,
		def_min : 0,
			get def_gap () {
				return this["def_max"] - this["def_min"];
			},
		def_unit : 10,
		
		critical_max : 220,// - 48 = 227 / 220 + 48 = 268
		critical_min : 80,// - 48 = 52 / 80 + 48 = 128
			get critical_gap () {
				return this["critical_max"] - this["critical_min"];
			},
		critical_unit : 5,
		
		critical_damage_max : 2.5,
		critical_damage_min : 1.5,
			get critical_damage_gap () {
				return this["critical_damage_max"] - this["critical_damage_min"];
			},
		critical_damage_unit : 0.1
	},
	
	
	//게임 상태
	end : 0// 1이 되면 게임이 끝남을 의미
}


//플레이어 정보
var player = [
	{},//공백 (실제 순서와 i를 맞추기 위한 더미 데이터)
	{//플레이어 1 능력치
		//1. 주 능력치 (초기)
		life_init : 0,//최초 체력
		atk_init : 0,//최초 공격력
			atk_rage : 0,//분노 시 상승 공격력
		def_init : 0,//최초 방어력
			def_rage : 0,//분노 시 상승 방어력
		critical_init : 0,//"초기에 주어진" 크리티컬 게이지
		critical_damage : 0,//크리티컬 증폭 피해량
		spd : 0,//속도
		rage : 0,//분노 레벨
			/*차후 제거*/
			rage_delay : 0,//대기중인 스킬 발동 횟수
		//2. 주 능력치 (변경)
		life_now : 0,//현재 체력
		atk_now : 0,//현재 공격력
		def_now : 0,//현재 방어력
		critical_now : 0,//현재 크리티컬 게이지
		
		life_real : 0,//실시간 체력
		atk_real : 0,//실시간 공격력
		def_real : 0,//실시간 방어력
		critical_real : 0,//실시간 크리티컬 게이지
		//3. 부가 능력치
		combo:1,//공격 횟수
			hit_remain:0,//현재 남은 공격 횟수 (소모된 이후 combo 수치만큼 리필됨)
		//4. 기타
		code : ""//MD5 코드 (선공 결정 시 seed로 사용)
	},
	{//플레이어 2 능력치
		//1. 주 능력치 (초기)
		life_init : 0,//최초 체력
		atk_init : 0,//최초 공격력
			atk_rage : 0,//분노 시 상승 공격력
		def_init : 0,//최초 방어력
			def_rage : 0,//분노 시 상승 방어력
		critical_init : 0,//"초기에 주어진" 크리티컬 게이지
		critical_damage : 0,//크리티컬 증폭 피해량
		spd : 0,//속도
		rage : 0,//분노 레벨
			/*차후 제거*/
			skill_ready : 0,//대기중인 스킬 발동 횟수
		//2. 주 능력치 (변경)
		life_now : 0,//현재 체력
		atk_now : 0,//현재 공격력
		def_now : 0,//현재 방어력
		critical_now : 0,//현재 크리티컬 게이지
		
		life_real : 0,//실시간 체력
		atk_real : 0,//실시간 공격력
		def_real : 0,//실시간 방어력
		critical_real : 0,//실시간 크리티컬 게이지
		//3. 부가 능력치
		combo:1,//공격 횟수
			hit_remain:0,//현재 남은 공격 횟수 (소모된 이후 combo 수치만큼 리필됨)
		//4. 기타
		code : ""//MD5 코드 (선공 결정 시 seed로 사용)
	}
];


//연속 실행
var auto = {
	//게임 상태
	event : null,
	end : null,//이벤트 종료시에만 작동
	//플레이어 상태
	player : [
		{},//더미
		{//플레이어 1
			//능력치
			life : null,//체력
			atk : null,//공격력
			def : null,//방어력
			//이펙트
			hit : null,
			particle : null,
			rage : null,
			//피해 수치
			damage : null
		},
		{//플레이어 2
			life : null,//체력
			atk : null,//공격력
			def : null,//방어력
			//이펙트
			hit : null,
			particle : null,
			rage : null,
			//피해 수치
			damage : null
		}
	]
};


//테마 리스트
var themeList = [
	"seatrain",//해상열차
	"street",//길거리
	"tower",//탑
	"night",//밤
	"forest",//숲
	"bakal"//바칼
]


//이미지 (선로딩)
var imageList = [];


//음악
	//전체 BGM 리스트 (이름 : 주소)
		//※ value : 앞에 new Audio를 붙임
		//★ 실행 : bgm("-name-");
	try {
		var track_bgm = {
			//문 여는 소리
			gate : new Audio("http://cfile231.uf.daum.net/attach/257F5B4556220C6F2E3D4E"),
			//스테이지
				//1. 해상열차
				seatrain : new Audio("http://cfile238.uf.daum.net/attach/2358833F56220CC8330746"),
				//2. 길거리
				street : new Audio("http://cfile213.uf.daum.net/attach/2479403C56220CF32055E3"),
				//3. 탑
				tower : new Audio("http://cfile232.uf.daum.net/attach/23635B3456220E1221596C"),
				//4. 밤
				night : new Audio("http://cfile214.uf.daum.net/attach/270D8E3F56220CC509585C"),
				//5. 숲
				forest : new Audio("http://cfile206.uf.daum.net/attach/2432D14556220C3E03D0A6"),
				//6. 바칼의 성
				bakal : new Audio("http://cfile226.uf.daum.net/attach/23131C3F56220C28020179"),
		}
	} catch(e) {
		//에러 방지용
		alert("※ 현재 브라우저에서는 사운드 출력을 지원하지 않습니다.");
		//사운드 실행 방지
		game["sound"] = -1;
	};
	//전체 사운드 이펙트 리스트
		//※ value : 단순 문자열을 붙입
		//★ 실행 : sfx("-name-");
	var track_sfx = {
		ready : "http://cfile222.uf.daum.net/attach/22756F43562211861F05BA",
		fight : "http://cfile232.uf.daum.net/attach/2705A6435622118112486C",
		
		hit : "http://cfile232.uf.daum.net/attach/2268B44356221181291F32",
		critical : "http://cfile223.uf.daum.net/attach/2303ED435622117F140B49",
		particle : "http://cfile207.uf.daum.net/attach/23632C43562211832E6A5B",
		rage : "http://cfile209.uf.daum.net/attach/21125D4356221185078C44",
		
		loose : "http://cfile231.uf.daum.net/attach/2570B6435622118222D81D",
		victory : "http://cfile205.uf.daum.net/attach/22079A4356221187105391",
		
		close : "http://cfile219.uf.daum.net/attach/257AC4435622117E1B4814"
	}
	
	
	//음악 실행용 변수
	var audio_bgm;
	try {
		audio_bgm = new Audio("http://cfile231.uf.daum.net/attach/257F5B4556220C6F2E3D4E");//배경음악 - 한 번에 하나씩
	} catch(e) {}
	//효과음 - 한 번에 여러개 (soundList에서 관리)
	
	//사운드 이펙트 동시실행 관리
	var sameAudio = 7;//한 번에 동시재생 가능한 음악 개수 (sfx 한정)
	var soundList = {};//음악 저장소 (sameAudio 수치만큼 같은 음악들이 들어있음)
	var playList = [];//현재 재생중인 Audio 리스트