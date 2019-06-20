using UnityEngine;
using System.Collections;

public class Game2_Bullet : MonoBehaviour
{
	public float moveSpeed = 30f;	//Move Speed
	public int damage = 40;			//Damage
	public float destroyTime = 1;	//Destroy Time
	
	void Start()
	{
		//Start Destroy
		StartCoroutine(Destroy(destroyTime));
	}
	
	void Update ()
	{
		//Move Bullet
		transform.Translate(0, 0, moveSpeed * Time.deltaTime);
		//Set y position to 0
		transform.position = new Vector3(transform.position.x,0,transform.position.z);
	}
	
	void OnCollisionEnter(Collision other)
	{
		//If we hit a enemy
		if (other.gameObject.tag == "Enemy")
		{
			//Hit the enemy
			other.gameObject.GetComponent<Game2_Enemy>().Hit(damage);
			//Destroy the bullet
			StartCoroutine(Destroy(0));
		}
		else
		{
			//Destroy the bullet
			StartCoroutine(Destroy(0));
		}
	}
	
	IEnumerator Destroy(float _time)
	{
		//Wait destroyTime
		yield return new WaitForSeconds(_time);
		//Destroy the bullet
		Destroy(gameObject);
	}
}
