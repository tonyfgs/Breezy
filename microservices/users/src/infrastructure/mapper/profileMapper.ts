import { Profile } from "../../domain/entities/Profile";
import {IProfileDocument} from "../models/ProfileModel";

export class ProfileMapper {
    static toDomain(doc: IProfileDocument): Profile {
        const profile = new Profile(doc.username, doc.bio, doc.avatar, doc._id.toString());
        profile.createdAt = doc.createdAt;
        profile.updatedAt = doc.updatedAt;
        return profile;
    }


}