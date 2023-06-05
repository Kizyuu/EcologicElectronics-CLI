import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'
import IUser from '../interfaces/IUser';
import { HttpClient } from '@angular/common/http';
import { observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public user: IUser = {}; 
  public storage: Storage;
  private api: string = 'http://localhost:3333'

  constructor(storage: Storage, private http:HttpClient) {
    this.storage = storage;
    this.storage.create();

   }

  public async login(email:string, password:string, keepMeLoggedIn: boolean){
    const response =  await fetch(`${this.api}/login?email=${email}&senha=${password}`);
    const data = await response.json();
    const userData = data;
    this.user = {id: userData.id, 
      firstName: userData.nome,
      lastName: userData.sobrenome,
      email: userData.email,
      password: userData.senha,
      phoneNumber: userData.telefone,
      cpf: userData.cpf};
    this.storage.set('user', this.user);
    this.storage.set('keepLogin', keepMeLoggedIn);
  }
  
  //Metodo 'POST' usando GET.
  public async signup(firstName:string, lastName: string, email:string, password:string){
    const response =  await fetch(`${this.api}/signup?nome=${firstName}&sobrenome=${lastName}&email=${email}&senha=${password}`);
    const data = await response.json();
    const userData = data[0];
    this.user = {id: userData.id, 
      firstName: userData.nome,
      lastName: userData.sobrenome,
      email: userData.email,
      password: userData.senha,
      phoneNumber: userData.telefone,
      cpf: userData.cpf};
    this.storage.set('user', this.user);
    this.storage.set('keepLogin', false);
  }

  public async checkUser():Promise<boolean>{
    this.user = await this.storage.get('user');
    return this.user != null ? true : false;
  }

  public async setUser(updatedUser: IUser){
    this.user = updatedUser
    this.storage.set('user', this.user);
  }

  public async getUser(){
    this.user = await this.storage.get('user');
    return this.user;
  }

  public async startUser(){
    let keepLogin = false;
    keepLogin = await this.storage.get('keepLogin');
    if(keepLogin == false){
      this.storage.clear();
      console.log('Usuario resetado com sucesso!');
    }
  }
}
