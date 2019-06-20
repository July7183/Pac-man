public var moveSpeed : float;			//Move speed
public var attackSpeed : float;			//Attack speed
public var damage : int;				//Damage
private var tmpAttackSpeed : float;		//Tmp attack speed
public var hitFX : GameObject;			//Hit FX
public var dead : GameObject;			//Are we dead
private var player : Transform;			//The player
private var hp = 100;					//Health

function Start ()
{
	//Find player
	player = GameObject.Find("Player").transform;
}

function Update ()
{
	//If the distance between the player position and the our position is over 1 meter
	if (Vector3.Distance(player.position,transform.position) > 1)
	{
		//Update
		MoveUpdate();
	}
	else
	{
		//If tmpAttackSpeed is bigger than attackSpeed
		if (tmpAttackSpeed > attackSpeed)
		{
			//Set tmpAttackSpeed to 0
			tmpAttackSpeed = 0;
			//Hit the player
			player.GetComponent(Game2_Player).Hit(damage);
		}
		else
		{
			//Add 1 to tmpAttackSpeed
			tmpAttackSpeed += 1 * Time.deltaTime;
		}
	}
}

function MoveUpdate()
{
	//Move enemy
	transform.Translate(Vector3.forward * moveSpeed * Time.smoothDeltaTime);
	//Rotate enemy
	transform.rotation = Quaternion.LookRotation(player.position - transform.position);	
}

public function Hit(_damage : int)
{
	//Instantiate hit FX
	Instantiate(hitFX,transform.position,Quaternion.identity);
	//Remove the damage value from the health
	hp -= _damage;
	//If health is less than 0
	if (hp <= 0)
	{
		//Instantiate hit FX
		Instantiate(hitFX,transform.position,Quaternion.identity);
		//Instantiate dead FX
		Instantiate(dead,transform.position,Quaternion.identity);
		//Destroy
		Destroy(gameObject);
	}
}