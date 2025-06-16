import { goto } from "$app/navigation";
import type { Database } from "$lib/types/database.types";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { getContext, setContext } from "svelte";

export type Book = Database['public']['Tables']['books']['Row']

interface UserStateProps {
    session: Session | null;
    supabase: SupabaseClient | null;
    user: User | null
}

export class UserState {
    session = $state<Session | null>(null);
    supabase = $state<SupabaseClient<Database> | null>(null);
    user = $state<User | null>(null)
    allBooks = $state<Book[]>([]);
    userName = $state<string | null>(null);

    constructor(data: UserStateProps) {
        this.updateState(data);
    }
    
    updateState(data: UserStateProps) {
        this.session = data.session;
        this.supabase = data.supabase;
        this.user = data.user;
        this.fetchUserData();
    }

    async fetchUserData() {
        if(!this.user || !this.supabase) return;

        const userId = this.user.id 

        const [booksResponse, userNamesResponse] = await  Promise.all([
            await this.supabase.from("books").select("*").eq("user_id", userId),
            await this.supabase.from("user_names").select("name").eq("user_id", userId ).single()
        ])

        if(booksResponse.error || !booksResponse.data || userNamesResponse.error || !userNamesResponse.data) { 
            console.log("Erorr fetching data for user")
            console.log({booksResponse: booksResponse.error, userNamesResponse: userNamesResponse.error})
            return;
        } 
        
        this.allBooks = booksResponse.data;
        this.userName = userNamesResponse.data.name;
    }

    logout() {
        this.supabase?.auth.signOut();
        goto('/login'); //TODO: Isn't working, to fix
    }
}

const USER_STATE_KEY = Symbol("USER_STATE") //ID

export function setUserState(data: UserStateProps) {
    return setContext(USER_STATE_KEY, new UserState(data))
}

export function getUserState() {
    return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}