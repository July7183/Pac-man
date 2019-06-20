public var moveSpeed = 30.0f;	//Move Speed
public var damage = 40;			//Damage
public var destroyTime = 1.0f;	//Destroy Time

function Start()
{
	//Start Destroy
	StartCoroutine(Destroy(destroyTime));
}

function Update ()
{
	//Move Bullet
	transform.Translate(0, 0, moveSpeed * Time.deltaTime);
	//Set y position to 0
	transform.position = Vector3(transform.position.x,0,transform.position.z);
}

function OnCollisionEnter(other : Collision)
{
	//If we hit a enemy
	if (other.gameObject.tag == "Enemy")
	{
		//Hit the enemy
		other.gameObject.GetComponent(Game2_Enemy).Hit(damage);
		//Destroy the bullet
		StartCoroutine(Destroy(0));
	}
	else
	{
		//Destroy the bullet
		StartCoroutine(Destroy(0));
	}
}

function Destroy(_time : float)
{
	//Wait destroyTime
	yield WaitForSeconds(_time);
	//Destroy the bullet
	Destroy(gameObject);
}