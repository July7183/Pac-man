public var spawnPosition : Transform[];		//All spawn positions
public var enemy : GameObject;				//Enemy prefab
public var spawnTime : float;				//Spawn time
private var tmpSpawnTime : float;			//Tmp spawn time
private var player : GameObject;			//The player

function Start ()
{
	//Find player
	player = GameObject.Find("Player");
}
	
function Update ()
{
	//tmpSpawnTime is bigger than spawnTime
	if (tmpSpawnTime > spawnTime)
	{
		//Set tmpSpawnTime to 0
		tmpSpawnTime = 0;
		//Spawn enemy
		InstantiateEnemy();
	}
	else
	{
		//Add 1 to tmpSpawnTime
		tmpSpawnTime += 1 * Time.deltaTime;
	}
}

function InstantiateEnemy()
{
	//Set a to a random spawn position
	var a = Random.Range(0,spawnPosition.Length);
	
	//If the distance between the spawn position and the player positon is bigger than 15
	if (Vector3.Distance(spawnPosition[a].position,player.transform.position) > 15)
	{
		//Spawn enemy
		Instantiate(enemy,spawnPosition[a].position,Quaternion.identity);
	}
	else
	{
		//Start the function again
		InstantiateEnemy();	
	}
}