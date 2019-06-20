public var skin : GUISkin;						//GUI Skin
public var mesh : GameObject;					//Mesh
public var cameraGO : GameObject;				//Main Camera
public var moveSpeed : float;					//Move speed
public var hp = 100;							//Health
public var hitFX : GameObject;					//Hit FX
public var texMove : Texture2D[];				//Move textures
public var texUpdateTime : float;				//Textures uodate time
private var tmpTexUpdateTime : float;			//Tmp textures uodate time
private var selectedTex : int;					//Selected Textures
public var bullet : GameObject;					//Bullet prefab
public var audioLaser : AudioClip;				//Laser sound
public var fireTime : float;					//Fire time
private var tmpFireTime : float;				//Tmp fire time
public var spawnBulletPosition : Transform;		//Bullet Spawn position
private var dead = false;						//Are we dead
private var dir : Vector3;						//The move direction
private var lookDir : Vector3;					//The look direction
private var tempVector : Vector3;				//We need this to figure out where to look
private var tempVector2 : Vector3;				//We need this to figure out where to look
private var leftJoystick : GameObject;			//The left joystick
private var rightJoystick : GameObject;			//The right joystick

function Start ()
{
	//Set the screen orientation to landscape left
	Screen.orientation = ScreenOrientation.LandscapeLeft;
	//Find left joystick
	leftJoystick = GameObject.Find("Left Joystick");
	//Find right joystick
	rightJoystick = GameObject.Find("Right Joystick");
	//Start SetupJoysticks
	StartCoroutine("SetupJoysticks");
	//Set sleep time to nerver
	Screen.sleepTimeout = SleepTimeout.NeverSleep;
	//Set label color to black
	skin.label.normal.textColor = Color.black;
}

function Update ()
{
	//Update
	MoveUpdate();
	//Set camare position
	cameraGO.transform.position = new Vector3(transform.position.x,10,transform.position.z);
}

function MoveUpdate()
{
	//If the game is not running on a android device
	if (Application.platform != RuntimePlatform.Android)
	{
		//Horizontal axis and Vertical axis is not 0
		if (Input.GetAxis("Horizontal") != 0 || Input.GetAxis("Vertical") != 0)
		{
			//Set dir x to Horizontal and dir z to Vertical
			dir = new Vector3(Input.GetAxis("Horizontal"),0,Input.GetAxis("Vertical"));
			//Update Textures
			TexUpdate();
		}
		else
		{
			//Set dir to 0
			dir = new Vector3(0,0,0);
		}
		//Find the center of the screen
		tempVector2 = new Vector3(Screen.width * 0.5f,0,Screen.height * 0.5f);
		//Get mouse position
		tempVector = Input.mousePosition;
		//Set tempVector z to tempVector.y
		tempVector.z = tempVector.y;
		//Set tempVector y to 0
		tempVector.y = 0;
		//Set lookDir to  tempVector - tempVector2
		lookDir = tempVector - tempVector2;
		
		//If left mouse click
		if (Input.GetMouseButton(0))
		{
			//tmpFireTime is bigger than fireTime
			if (tmpFireTime >= fireTime)
			{
				//Set tmpFireTime to 0
				tmpFireTime = 0;
				
				//Instantiate bullet
				var go = Instantiate(bullet, spawnBulletPosition.position, Quaternion.LookRotation(lookDir)) as GameObject;
				//Ignore collision with other bullets
				Physics.IgnoreCollision(go.GetComponent.<Collider>(), GetComponent.<Collider>());
				//If the sound is playing
				if (!GetComponent.<AudioSource>().isPlaying)
				{
					//Play laser sound
					GetComponent.<AudioSource>().clip = audioLaser;
					GetComponent.<AudioSource>().Play();
				}
			}
			//If tmpFireTime less than fireTime
			else if (tmpFireTime < fireTime)
			{
				//Add 1 to tmpFireTime
				tmpFireTime += 1 * Time.deltaTime;
			}
		}
	}
	//If the game is running on a android device
	else
	{
		//Get left joystick x position
		var mX = leftJoystick.GetComponent(Joystick).position.x;
		//Get left joystick y position
		var mY = leftJoystick.GetComponent(Joystick).position.y;
		//If joystick x position and left joystick y position is not 0
		if (mX != 0 || mX != 0 || mY != 0 || mY != 0)
		{
			//Set dir x to joystick x position and dir z joystick y position
			dir = new Vector3(mX,0,mY);
			//Update Textures
			TexUpdate();
		}
		else
		{
			//Set dir to 0
			dir = new Vector3(0,0,0);
		}
		
		//Get right joystick x position
		var lX = rightJoystick.GetComponent(Joystick).position.x;
		//Get right joystick y position
		var lY = rightJoystick.GetComponent(Joystick).position.y;
		//If joystick x position and left joystick y position is not 0
		if (lX != 0 || lX != 0 || lY != 0 || lY != 0)
		{
			//Set lookDir x to joystick x position and dir z joystick y position
			lookDir = new Vector3(lX,0,lY);
			
			//If tmpFireTime is bigger than fireTime
			if (tmpFireTime >= fireTime)
			{
				//Set tmpFireTime to 0
				tmpFireTime = 0;
				
				//Spawn bullet
				var go2 = Instantiate(bullet, spawnBulletPosition.position, Quaternion.LookRotation(lookDir)) as GameObject;
				
				//Ignore collision with other bullets
				Physics.IgnoreCollision(go2.GetComponent.<Collider>(), GetComponent.<Collider>());
			}
			//If tmpFireTime is less than fireTime
			else if (tmpFireTime < fireTime)
			{
				//Add 1 to tmpFireTime
				tmpFireTime += 1 * Time.deltaTime;
			}
		}
	}
	
	//Move player
	transform.Translate(dir * moveSpeed * Time.smoothDeltaTime,Space.World);
	//Rotate player
	transform.rotation = Quaternion.LookRotation(lookDir);	
}

function TexUpdate()
{
	//If tmpTexUpdateTime is bigger than texUpdateTime
	if (tmpTexUpdateTime > texUpdateTime)
	{
		//Set tmpTexUpdateTime to 0
		tmpTexUpdateTime = 0;
		//Add 1 to selectedTex
		selectedTex++;
		//If selectedTex is bigger than texMove Length - 1
		if (selectedTex > texMove.Length - 1)
		{
			//Set selectedTex to 0
			selectedTex = 0;
		}
		//Set mesh material main texture to selectedTex in texMove
		mesh.GetComponent.<Renderer>().material.mainTexture = texMove[selectedTex];
	}
	else
	{
		//Add 1 to tmpTexUpdateTime
		tmpTexUpdateTime += 1 * Time.deltaTime;
	}
}

public function Hit(_damage : int)
{
	//Instantiate hit FX
	Instantiate(hitFX,transform.position,Quaternion.identity);
	//Remove damge value form health
	hp -= _damage;
	//If health is less than 0
	if (hp <= 0)
	{
		//Instantiate hit FX
		Instantiate(hitFX,transform.position,Quaternion.identity);
		//Instantiate hit FX
		Instantiate(hitFX,transform.position,Quaternion.identity);
		//Are we dead
		dead = true;
		//Set time scale to 0
		Time.timeScale = 0;
	}
}

function OnGUI()
{
	GUI.skin = skin;
	
	//Health
	GUI.Label(new Rect(10,10,300,300),"HP: " + hp.ToString());
	
	//Menu Button
	if(GUI.Button(new Rect(Screen.width - 120,0,120,40),"Menu"))
	{
		//Set time scale to 1
		Time.timeScale = 1;
		Application.LoadLevel("Menu");
	}
	//If we are dead
	if (dead)
	{
		//Play Again Button
		if(GUI.Button(new Rect(Screen.width / 2 - 90,Screen.height / 2 - 60,180,50),"Play Again"))
		{
			//Set time scale to 1
			Time.timeScale = 1;
			Application.LoadLevel("Game 2");
		}
		//Menu Button
		if(GUI.Button(new Rect(Screen.width / 2 - 90,Screen.height / 2,180,50),"Menu"))
		{
			//Set time scale to 1
			Time.timeScale = 1;
			Application.LoadLevel("Menu");
		}
	}	
}

function SetupJoysticks()
{
	//Set joystick position
	leftJoystick.transform.position = new Vector3(0.2f,0.2f,0);
	rightJoystick.transform.position = new Vector3(0.8f,0.2f,0);
	
	//Wait 1 seconds
	yield WaitForSeconds(1);
	
	//Start joystick
	leftJoystick.GetComponent(Joystick).StartGame();
	rightJoystick.GetComponent(Joystick).StartGame();
}