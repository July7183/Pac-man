using UnityEngine;
using System.Collections;

public class Game2_SpawnEnemy : MonoBehaviour
{
	public Transform[] spawnPosition;	//All spawn positions
	public GameObject enemy;			//Enemy prefab
	public float spawnTime;				//Spawn time
	private float tmpSpawnTime;			//Tmp spawn time
	private GameObject player;			//The player
	
	void Start ()
	{
		//Find player
		player = GameObject.Find("Player");
	}

	void Update ()
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
	
	void InstantiateEnemy()
	{
		//Set a to a random spawn position
		int a = Random.Range(0,spawnPosition.Length);
		
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
}
