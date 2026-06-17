import {IProfileRepository} from "../../domain/repositories/IProfileRepository";
import {Profile} from "../../domain/entities/Profile";
import {ProfileMapper} from "../mapper/profileMapper";
import {ProfileModel} from "../models/ProfileModel";

export class ProfileRepository implements IProfileRepository{


    async getAllProfiles(): Promise<Profile[]> {
        const results = await ProfileModel.find();
        return results.map(ProfileMapper.toDomain);
    }

    async getProfile(id: string): Promise<Profile> {
        const result = await ProfileModel.findById(id);
        if (!result) throw new Error(`Profile not found: ${id}`);
        return ProfileMapper.toDomain(result);
    }

    async getByUsername(username: string): Promise<Profile | null> {
        const result = await ProfileModel.findOne({ username: username });
        if (!result) return null;
        return ProfileMapper.toDomain(result);
    }

    async createProfile(profile: Profile): Promise<Profile> {
        const result = await ProfileModel.create(profile);
        if (!result) throw new Error('Profile not created');
        return ProfileMapper.toDomain(result);
    }

    async deleteProfile(id: string): Promise<void> {
        const result = await ProfileModel.findByIdAndDelete(id);
        if (!result) throw new Error(`Profile not found: ${id}`);
    }

    async patchProfile(id: string, data: Partial<Profile>): Promise<Profile> {
        const result = await ProfileModel.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true }
        );
        if (!result) throw new Error(`Profile not found: ${id}`);
        return ProfileMapper.toDomain(result);
    }
}
