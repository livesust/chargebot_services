import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import { Company } from "@chargebot-services/core/services/company";
import { IdPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CompanyResponseSchema } from "./company.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const company = await Company.get(+event.pathParameters!.id!);

    if (!company) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: company,
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(validator({ eventSchema: IdPathParamSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: CompanyResponseSchema }));