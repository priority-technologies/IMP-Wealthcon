import { adminRoles } from "../../../helpers/constant";
import Notes from "../../../schemas/Notes";
import Videos from "../../../schemas/Videos";
import { NextResponse } from 'next/server';

const fetchData = async (model, query, projection, limit = 5) => {
    return model.find(query, projection).limit(limit).exec();
};

export async function POST(request) {
    const loggedUserRole = request.headers.get("x-user-role");
    try {
        const reqBody = await request.json();
        const searchValue = reqBody?.search?.toLowerCase();

        if (!searchValue) {
            return NextResponse.json(
                { error: "Please provide a valid search value." },
                { status: 400 }
            );
        }

        const regex = new RegExp(searchValue, 'i');

        const roles = loggedUserRole === 'admin' || loggedUserRole === 'superAdmin'
            ? adminRoles
            : loggedUserRole
                ? ['all', loggedUserRole]
                : ['all'];

        const commonQuery = {
            studentCategory: { $in: roles },
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } }
            ],
        };

        // const galleryQuery = {
        //     studentCategory: { $in: roles },
        //     title: { $regex: regex }
        // };

        const projection = {
            _id: 1,
            title: 1,
            thumbnail: 1,
        };

        const [videos, notes] = await Promise.all([
            fetchData(Videos, commonQuery, projection),
            fetchData(Notes, commonQuery, projection),
            // fetchData(Gallary, galleryQuery, projection),
        ]);

        // Combine results
        const allData = {
            videos,
            notes
        };

        return NextResponse.json({ data: allData });
    } catch (error) {
        console.error("Error while processing search:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
