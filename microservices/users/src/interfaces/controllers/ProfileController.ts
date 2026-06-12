import {IProfileRepository} from "../../domain/repositories/IProfileRepository";
import {CreateProfileUseCase} from "../../application/usecases/CreateProfileUseCase";
import {DeleteProfileUseCase} from "../../application/usecases/DeleteProfileUseCase";
import {GetProfileUseCase} from "../../application/usecases/GetProfileUseCase";
import {GetAllProfilesUseCase} from "../../application/usecases/GetAllProfilesUseCase";
import {UpdateProfileUseCase} from "../../application/usecases/UpdateProfileUseCase";
import {IController} from "./IController";
import e, {Router} from "express";
import {ProfileDTO} from "../../application/dto/ProfileDTO";

export class ProfileController implements IController{

    public readonly path: string= '/users/';
    public readonly router = Router();

    private createProfileUseCase: CreateProfileUseCase;
    private deleteProfileUseCase: DeleteProfileUseCase;
    private getProfileUseCase: GetProfileUseCase;
    private getAllProfilesUseCase: GetAllProfilesUseCase;
    private updateProfileUseCase: UpdateProfileUseCase;

    constructor(getProfileUseCase: GetProfileUseCase, createProfileUseCase: CreateProfileUseCase, deleteProfileUseCase: DeleteProfileUseCase, updateProfileUseCase: UpdateProfileUseCase, getAllProfilesUseCase: GetAllProfilesUseCase) {
        this.getProfileUseCase = getProfileUseCase;
        this.createProfileUseCase = createProfileUseCase;
        this.deleteProfileUseCase = deleteProfileUseCase;
        this.updateProfileUseCase = updateProfileUseCase;
        this.getAllProfilesUseCase = getAllProfilesUseCase;
        this.initialiseRoutes();
    }

    private initialiseRoutes() {

        // Get all profiles
        this.router.get(`/`, this.getAllProfiles.bind(this));

        // Get Profile by id
        this.router.get(`/:id`, this.getProfile.bind(this));

        // Create Profile
        this.router.post(`/`, this.createProfile.bind(this));
    }

    private async getAllProfiles(_req: any, res: any): Promise<void> {
        const profiles = await this.getAllProfilesUseCase.execute();
        res.status(200).json(profiles);
    }

    private async createProfile(req: any, res: any): Promise<void> {
        const profile = req.body;
        console.log(profile)
        const newProfile = await this.createProfileUseCase.execute(profile);
        if (!newProfile) return res.status(400).json({message: 'Profile already exists'});
        res.status(201).json(newProfile);
    }

    private async deleteProfile(req: any, res: any): Promise<void> {
        const id = req.params.id;
        await this.deleteProfileUseCase.execute(id);
    }

    private async getProfile(req: any, res: any): Promise<void> {
        const id: string = req.params.id;
        const profile: ProfileDTO = await this.getProfileUseCase.execute(id);
        res.status(201).json(profile);
    }

    private async updateProfile(req: any, res: any): Promise<any> {
        const id = req.params.id;
        const profile = req.body;
        const updatedProfile = await this.updateProfileUseCase.execute(id, profile);
        return updatedProfile;
    }



}
