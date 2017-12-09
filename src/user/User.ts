export class User {
    private id : string;
    private name: string;
    private token: string;

    constructor(idUser:string, name:string, token:string){
        this.id = idUser;
        this.name = name;
        this.token = token;
    }

    public toJSON() {
        return {
            name: this.name,
            token: this.token
        };
    }
}