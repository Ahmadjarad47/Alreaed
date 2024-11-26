using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.infrastructure.Shared
{
    public static class EmailStringBody
    {
        public static string Send(string email, string token, string component, string message)
        {
            string encodeToken = Uri.EscapeDataString(token);

            // Define conditional text based on the component value
            string actionMessage = component switch
            {
                "reset-password" => "You recently requested to reset your account password. To ensure the security of your account, please use the button below to complete the process.",
                "active" => "Welcome to Alraed Center! We are thrilled to have you join us. Activate your account now and explore a world of innovation in car repair and development.",
                _ => "Take action now by clicking the button below to proceed with your request." // Default fallback text
            };

            string additionalNote = component switch
            {
                "reset-password" => "If you did not make this request, please ignore this email. Your account remains secure.",
                "active" => "By activating your account, you gain access to premium features and updates on our latest services.",
                _ => "For further assistance, contact our support team."
            };


            return $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Alraed Center</title>
    <style>
        /* General Reset */
        body {{
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f7f8fc;
            color: #333;
            line-height: 1.6;
        }}
        .container {{
            max-width: 700px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(45deg, #23395d, #4169e1);
            color: #ffffff;
            text-align: center;
            padding: 30px 0;
        }}
        .header h1 {{
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }}
        .header p {{
            font-size: 16px;
            margin-top: 10px;
        }}
        .content {{
            padding: 25px 40px;
        }}
        .content h1 {{
            font-size: 22px;
            color: #23395d;
            margin-bottom: 15px;
        }}
        .content p {{
            font-size: 16px;
            margin-bottom: 20px;
            color: #555;
        }}
        .content .button {{
            display: inline-block;
            background: linear-gradient(45deg, #ff7e5f, #feb47b);
            color: #ffffff;
            padding: 15px 40px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease-in-out;
            cursor: pointer;
            text-align: center;
        }}
        .content .button:hover {{
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }}
        .content .note {{
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }}
        .footer {{
            background: #23395d;
            color: #ffffff;
            text-align: center;
            padding: 15px 0;
            font-size: 14px;
        }}
        .footer p {{
            margin: 0;
            font-size: 14px;
        }}
        .footer .tagline {{
            margin-top: 5px;
            font-size: 12px;
            font-style: italic;
        }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Welcome to Alraed Center</h1>
            <p>Excellence in Car Repair and Development</p>
        </div>
        <div class='content'>
            <h4>{message}</h1>
            <p>{actionMessage}</p>
            <a class='button' href='http://localhost:4200/account/{component}?email={email}&token={encodeToken}'>
                {(component == "reset-password" ? "Reset Password" : "Activate Account")}
            </a>
            <p class='note'>{additionalNote}</p>
        </div>
        <div class='footer'>
            <p>&copy; {DateTime.Now.Year} Alraed Center. All Rights Reserved.</p>
            <p class='tagline'>Driving innovation, one car at a time.</p>
        </div>
    </div>
</body>
</html>";
        }
    }
}
