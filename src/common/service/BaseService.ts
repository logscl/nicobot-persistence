export class BaseService {
    public _handleDAOError(err: string) : object {
        console.log("[BaseService] Error from DAO : " + err);

        return {
            message: "Error in the persistence unit."
        };
    }
}