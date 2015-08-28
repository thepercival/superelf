<?php

namespace SuperElf\Console\Commands;

use Illuminate\Console\Command;

class ValidateGoals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'goals:validate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $mail = new \PHPMailer(true); // notice the \  you have to use root namespace here
        try {
            $mail->isSMTP(); // tell to use smtp
            $mail->CharSet = "utf-8"; // set charset to utf8
            $mail->SMTPAuth = false;  // use smpt auth
            $mail->Host = getenv('MAIL_HOST');
            // $mail->SMTPSecure = "tls"; // or ssl
            // $mail->Port = 2525; // most likely something different for you. This is the mailtrap.io port i use for testing.
            // $mail->Username = "username";
            // $mail->Password = "password";
            echo getenv('MAIL_FROMADDRESS');
            echo getenv('MAIL_FROMNAME');
            $mail->setFrom( getenv('MAIL_FROMADDRESS'), getenv('MAIL_FROMNAME') );
            $mail->Subject = "Test for deltion";
            $mail->MsgHTML("This is a test for the deltion college");
            $mail->addAddress("coendunnink@gmail.com");

            // DKIM
            if ( getenv('MAIL_DKIM') === "true" ) {
                $mail->DKIM_domain = getenv('MAIL_DKIM_DOMAIN');
                $mail->DKIM_private = APPLICATION_PATH . DIRECTORY_SEPARATOR . getenv('MAIL_DKIM_PRIVKEY');
                $mail->DKIM_selector = getenv('MAIL_DKIM_SELECTOR');
                $mail->DKIM_identifier = getenv('MAIL_FROMADDRESS');
            }

            $mail->send();
            $this->comment(PHP_EOL."succeeded!!".PHP_EOL);
        } catch (phpmailerException $e) {
            dd($e);
        } catch (Exception $e) {
            dd($e);
        }
        $this->comment(PHP_EOL."send email!!".PHP_EOL);
    }
}
