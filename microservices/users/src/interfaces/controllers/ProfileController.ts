import {IProfileRepository} from "../../domain/repositories/IProfileRepository";
import {CreateProfileUseCase} from "../../application/usecases/CreateProfileUseCase";
import {DeleteProfileUseCase} from "../../application/usecases/DeleteProfileUseCase";
import {GetProfileUseCase} from "../../application/usecases/GetProfileUseCase";
import {UpdateProfileUseCase} from "../../application/usecases/UpdateProfileUseCase";

export class ProfileController {

    private createProfileUseCase: CreateProfileUseCase;
    private deleteProfileUseCase: DeleteProfileUseCase;
    private getProfileUseCase: GetProfileUseCase;
    private updateProfileUseCase: UpdateProfileUseCase;

    constructor(repository: IProfileRepository) {
        this.createProfileUseCase = new CreateProfileUseCase(repository);
        this.deleteProfileUseCase = new DeleteProfileUseCase(repository);
        this.getProfileUseCase = new GetProfileUseCase(repository);
        this.updateProfileUseCase = new UpdateProfileUseCase(repository);
    }

    async createProfile(req: any, res: any): Promise<string> {
        const profile = req.body;
        const newProfile = await this.createProfileUseCase.execute(profile);
        return newProfile.id;
    }

    async deleteProfile(req: any, res: any): Promise<void> {
        const id = req.params.id;
        await this.deleteProfileUseCase.execute(id);
    }

    async getProfile(req: any, res: any): Promise<any> {
        const id = req.params.id;
        const profile = await this.getProfileUseCase.execute(id);
        return profile;
    }

    async updateProfile(req: any, res: any): Promise<any> {
        const id = req.params.id;
        const profile = req.body;
        const updatedProfile = await this.updateProfileUseCase.execute(id, profile);
        return updatedProfile;
    }
}
