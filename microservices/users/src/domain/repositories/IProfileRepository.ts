import {Profile} from "../entities/Profile";

export interface IProfileRepository {
    getProfile(id: string): Promise<Profile>;
    getByUsername(username: string): Promise<Profile | null>;
    patchProfile(id: string, profile: Profile): Promise<Profile>;
    deleteProfile(id: string): Promise<void>;
    createProfile(profile: Profile): Promise<Profile>;
}