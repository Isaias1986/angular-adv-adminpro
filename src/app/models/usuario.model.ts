import { environment } from "src/environments/environment";



const base_url = environment.base_url;

export class Usuario {

    constructor(
        
        public nombre:      string,
        public email:       string, 
        public password?:    string,          
        public img?:        string,
        public google?:     boolean,
        public role?:       string,
        public uid?:        string
    ){}


    get imagenUrl(){
        return this.img?.includes('https') ? 
        this.img : this.img ? 
            `${base_url}/upload/usuarios/${this.img}` : `${base_url}/upload/usuarios/no-image`; 
    
    }

}