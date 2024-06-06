import * as aws from "@pulumi/aws";
import { PolicyPack, validateResourceOfType, ReportViolation } from "@pulumi/policy";

new PolicyPack("lotctl-aws", {
	policies: [
		{
			name: "required-owner-tag",
			description: "A 'owner' tag is required.",
			enforcementLevel: "mandatory",
			validateResource: [
				validateResourceOfType(aws.s3.Bucket, (bucket, args, reportViolation) => {
					requireOwnerTag(bucket.tags, reportViolation);
				}),
			],
		},
	],
});

function requireOwnerTag(tags: any, reportViolation: ReportViolation) {
	if ((tags || {})["owner"] === undefined) {
		reportViolation("A 'owner' tag is required.");
	}
}
