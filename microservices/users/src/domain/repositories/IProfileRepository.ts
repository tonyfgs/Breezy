import {Profile} from "../entities/Profile";

export interface IProfileRepository {
    getProfile(id: string): Promise<Profile>;
    patchProfile(id: string, profile: Profile): Promise<Profile>;
    deleteProfile(id: string): Promise<void>;
    createProfile(profile: Profile): Promise<Profile>;

}