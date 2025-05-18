import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  companyName: string;
  name: string;
  otp: string;
}

export default function VerificationEmail({
  companyName,
  name,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Fsalyda Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Arial, sans-serif"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {name},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering your company {companyName} with Fsalyda.
            Please use the following verification code to complete your
            registration:
          </Text>
        </Row>
        <Row>
          <Text
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              backgroundColor: "#f0f0f0",
              padding: "10px 15px",
              borderRadius: "8px",
              display: "inline-block",
              letterSpacing: "3px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            {otp}
          </Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email or
            contact support.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
