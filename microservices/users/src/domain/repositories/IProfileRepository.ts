import {Profile} from "../entities/Profile";

export interface IProfileRepository {
    getAllProfiles(): Promise<Profile[]>;
    getProfile(id: string): Promise<Profile>;
    getByUsername(username: string): Promise<Profile | null>;
    patchProfile(id: string, data: Partial<Profile>): Promise<Profile>;
    deleteProfile(id: string): Promise<void>;
    deleteProfileByUsername(username: string): Promise<void>;
    createProfile(profile: Profile): Promise<Profile>;
}