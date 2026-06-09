import {IProfileRepository} from "../../domain/repositories/IProfileRepository";
import {Profiler} from "node:inspector";
import {Profile} from "../../domain/entities/Profile";

export class ProfileRepository implements IProfileRepository{
    createProfile(profile: Profile): Promise<Profile> {
        throw new Error('Not implemented');
    }

    deleteProfile(id: string): Promise<void> {
        throw new Error('Not implemented');
    }

    getProfile(id: string): Promise<Profile> {
        throw new Error('Not implemented');
    }

    patchProfile(id: string, profile: Profile): Promise<Profile> {
        throw new Error('Not implemented');
    }
}