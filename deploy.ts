import * as pulumi from "@pulumi/pulumi";
import * as service from "@pulumi/pulumiservice";
// import { local } from "@pulumi/command";

const config = new pulumi.Config();
const org = pulumi.getOrganization()
const project = pulumi.getProject()
const stack = pulumi.getStack()
// const gitOrigin = new local.Command("git_origin", {
//   create: 'git config --get remote.origin.url',
// }).stdout

const deploymentSettings = new service.DeploymentSettings("lotctl-deployment-settings", {
  organization: org,
  project: project,
  stack: stack,
  // agentPoolId: "d808edb9-3109-4196-b359-fca8ce04d1b6",
  operationContext: {
    preRunCommands: ["curl -o- -L https://yarnpkg.com/install.sh | bash", "yarn install"],
		environmentVariables: {
			PULUMI_ACCESS_TOKEN: config.requireSecret("pulumiAccessToken"),
		},		
		options: {
			skipInstallDependencies: true,
		},
  },
  sourceContext: {
    git: {
      branch: "refs/heads/main",
      repoUrl: "https://github.com/videmsky/aws-ts-static-website.git",
    }
  }
});

const driftSchedule = new service.DriftSchedule("driftSchedule", {
  organization: org,
  project: project,
  stack: stack,
  scheduleCron: "0 */4 * * *",
  autoRemediate: false
}, {dependsOn: [deploymentSettings]})

const ttlSchedule = new service.TtlSchedule("ttlSchedule", {
  organization: org,
  project: project,
  stack: stack,
  timestamp: "2024-12-07T00:00:00Z"
}, {dependsOn: [deploymentSettings]})