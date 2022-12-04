package com.apps.formezy;

import java.nio.charset.StandardCharsets;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

public class Test {
	public static void main(String args[]) {
	try {
	     // Encode a String into bytes
	     String inputString = "https://stackoverflow.com/questions/14430633/how-to-convert-text-to-binary-code-in-javascript";
	     byte[] input = inputString.getBytes("UTF-8");

	     // Compress the bytes
	     byte[] output = new byte[100];
	     Deflater compresser = new Deflater();
	     compresser.setInput(input);
	     compresser.finish();
	     int compressedDataLength = compresser.deflate(output);
	     compresser.end();
	     for(int i=0;i<100;i++) System.out.print(output[i]+" ");
	     System.out.println();
	     System.out.println(new String(output, StandardCharsets.UTF_8));

	     // Decompress the bytes
	     Inflater decompresser = new Inflater();
	     decompresser.setInput(output, 0, compressedDataLength);
	     byte[] result = new byte[100];
	     int resultLength = decompresser.inflate(result);
	     decompresser.end();

	     // Decode the bytes into a String
	     String outputString = new String(result, 0, resultLength, "UTF-8");
	     System.out.println(outputString+" "+resultLength);
	 } catch(java.io.UnsupportedEncodingException ex) {
	     // handle
	 } catch (java.util.zip.DataFormatException ex) {
	     // handle
	 }
	}
}
