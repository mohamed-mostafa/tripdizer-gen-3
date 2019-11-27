import { RequestResponse } from '../../../../request/request-dto.model';
import { Request } from '../../../../request/request.model';

export class PaymentInfo extends RequestResponse {
	paymentKey: string;

	static getPaymentInfoFromRequestResponse(request: Request, requestResponse: RequestResponse): PaymentInfo {
		return { ...requestResponse, paymentKey: requestResponse.paymentKey };
	}
}
