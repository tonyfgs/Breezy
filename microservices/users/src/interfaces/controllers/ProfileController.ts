import {CreateProfileUseCase} from "../../application/usecases/CreateProfileUseCase";
import {DeleteProfileUseCase} from "../../application/usecases/DeleteProfileUseCase";
import {DeleteProfileByUsernameUseCase} from "../../application/usecases/DeleteProfileByUsernameUseCase";
import {GetProfileUseCase} from "../../application/usecases/GetProfileUseCase";
import {GetProfileByUsernameUseCase} from "../../application/usecases/GetProfileByUsernameUseCase";
import {GetAllProfilesUseCase} from "../../application/usecases/GetAllProfilesUseCase";
import {UpdateProfileUseCase} from "../../application/usecases/UpdateProfileUseCase";
import {IController} from "./IController";
import {Router} from "express";
import {ProfileDTO} from "../../application/dto/ProfileDTO";
import {authenticate} from "../middlewares/authMiddleware";
import {requireRole} from "../middlewares/roleMiddleware";
import {requireProfileOwnershipOrAdmin} from "../middlewares/ownershipMiddleware";

export class ProfileController implements IController{

    public readonly path: string= '/users/';
    public readonly router: Router = Router();

    private createProfileUseCase: CreateProfileUseCase;
    private deleteProfileUseCase: DeleteProfileUseCase;
    private deleteProfileByUsernameUseCase: DeleteProfileByUsernameUseCase;
    private getProfileUseCase: GetProfileUseCase;
    private getProfileByUsernameUseCase: GetProfileByUsernameUseCase;
    private getAllProfilesUseCase: GetAllProfilesUseCase;
    private updateProfileUseCase: UpdateProfileUseCase;

    constructor(getProfileUseCase: GetProfileUseCase, createProfileUseCase: CreateProfileUseCase, deleteProfileUseCase: DeleteProfileUseCase, updateProfileUseCase: UpdateProfileUseCase, getAllProfilesUseCase: GetAllProfilesUseCase, deleteProfileByUsernameUseCase: DeleteProfileByUsernameUseCase, getProfileByUsernameUseCase: GetProfileByUsernameUseCase) {
        this.getProfileUseCase = getProfileUseCase;
        this.createProfileUseCase = createProfileUseCase;
        this.deleteProfileUseCase = deleteProfileUseCase;
        this.deleteProfileByUsernameUseCase = deleteProfileByUsernameUseCase;
        this.getProfileByUsernameUseCase = getProfileByUsernameUseCase;
        this.updateProfileUseCase = updateProfileUseCase;
        this.getAllProfilesUseCase = getAllProfilesUseCase;
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        // GET /users/ : Securise, necessite d'etre authentifie
        this.router.get(`/`, authenticate, this.getAllProfiles.bind(this));

        // GET /users/username/:username : Securise, necessite d'etre authentifie
        this.router.get(`/username/:username`, authenticate, this.getProfileByUsername.bind(this));

        // GET /users/:id : Securise, necessite d'etre authentifie
        this.router.get(`/:id`, authenticate, this.getProfile.bind(this));

        // POST /users/ : Public (creation de compte visiteur)
        this.router.post(`/`, this.createProfile.bind(this));

        // DELETE /users/username/:username : Réservé aux Administrateurs et Modérateurs
        this.router.delete(`/username/:username`, authenticate, requireRole(['Administrateur', 'Modérateur']), this.deleteProfileByUsername.bind(this));

        // DELETE /users/:id : Le propriétaire du compte OU les Administrateurs et Modérateurs
        this.router.delete(`/:id`, authenticate, requireProfileOwnershipOrAdmin, this.deleteProfile.bind(this));

        // PATCH /users/:id : Le propriétaire du compte OU les Administrateurs et Modérateurs
        this.router.patch(`/:id`, authenticate, requireProfileOwnershipOrAdmin, this.patchProfile.bind(this));
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
        try {
            await this.deleteProfileUseCase.execute(req.params.id);
            res.status(200).json({ message: 'Profile deleted successfully' });
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }

    private async deleteProfileByUsername(req: any, res: any): Promise<void> {
        try {
            await this.deleteProfileByUsernameUseCase.execute(req.params.username);
            res.status(200).json({ message: 'Profile deleted successfully' });
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }

    private async getProfileByUsername(req: any, res: any): Promise<void> {
        try {
            const profile = await this.getProfileByUsernameUseCase.execute(req.params.username);
            res.status(200).json(profile);
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }

    private async getProfile(req: any, res: any): Promise<void> {
        const id: string = req.params.id;
        const profile: ProfileDTO = await this.getProfileUseCase.execute(id);
        res.status(200).json(profile);
    }

    private async patchProfile(req: any, res: any): Promise<void> {
        try {
            const updated = await this.updateProfileUseCase.execute(req.params.id, req.body);
            res.status(200).json(updated);
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }
}
