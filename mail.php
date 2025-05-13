<?php
header("Content-Type: text/html; charset=utf-8");

$mail='phillipealaksa@email.cz';

	$data="";
    $data.="<h2>Odesílatel: ".$_POST['jmeno']. $_POST['prijmeni']."</h2>";
    $data.="<h2>Telefon: ".$_POST['telefon']."</h2>";
    $data.="<h2>Email: ".$_POST['email']."</h2>";
    $data.="<h2>Objednávka: ".$_POST['mnostvi']."kusů ".$_POST['produkt']."</h2>";
    $data.="<h2>Jeden kus: ".$_POST['cena']." Kč</h2>";
		odesli_mail($mail,$_POST['predmet'] , $data,$mail);

function odesli_mail($komu, $predmet, $telo,$kontakt) {
		
		$boundary = uniqid('np');
	
		$telo=str_replace("../","",$telo);	
		$subject = "=?utf-8?B?" . base64_encode($predmet) . "?="; 
		
		$hlavicka = "MIME-Version: 1.0\n";
		//$hlavicka.= "Content-Type: text/html; charset=\"utf-8\"\n";
		$hlavicka.= "From: ".$kontakt."\n";
		$hlavicka.= "Reply-To: ".$kontakt."\n";
		$hlavicka.= "X-Mailer: PHP/: ".phpversion()."\n";
		$hlavicka .= "Content-Type: multipart/alternative;boundary=" . $boundary . "\r\n";
		
		
		//here is the content body
		$message = "This is a MIME encoded message.";
		$message .= "\r\n\r\n--" . $boundary . "\r\n";
		$message .= "Content-type: text/plain;charset=utf-8\r\n\r\n";
		$message .= strip_tags($telo);
		$message .= "\r\n\r\n--" . $boundary . "\r\n";
		
		$message .= "Content-type: text/html;charset=utf-8\r\n\r\n";
		$message .= '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml">
		<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head><body>';
		$message .= $telo;
		$message .= '</body></html>';
		$message .= "\r\n\r\n--" . $boundary . "\r\n";
		
		$message .= "\r\n\r\n--" . $boundary . "--";
		
		
		$url = '"https://www.oknaorsag.cz"';
		
		if(mail($komu, $subject, $message, $hlavicka)) {
			echo "<script type='text/javascript'>alert('Vaše zpráva byla uspěšně odeslána. Děkujeme za zprávu.');window.location.href={$url};</script>";
		}
			else {
			echo "<script type='text/javascript'>alert('Odeslání zprávy se nezdařilo.');window.location.href={$url};</script>";}

	}
?>