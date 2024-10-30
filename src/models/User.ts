export class User{

    #id;
    #username;
    #email;
    #password;

    constructor(id:number, username:string, email:string, password:string) {
        this.#id = id;
        this.#username = username;
        this.#email = email;
        this.#password = password;
    }

    get id(): number {
        return this.#id;
    }

    set id(value: number) {
        this.#id = value;
    }

    get username(): string {
        return this.#username;
    }

    set username(value: string) {
        this.#username = value;
    }

    get email(): string {
        return this.#email;
    }

    set email(value: string) {
        this.#email = value;
    }

    get password(): string {
        return this.#password;
    }

    set password(value: string) {
        this.#password = value;
    }
}