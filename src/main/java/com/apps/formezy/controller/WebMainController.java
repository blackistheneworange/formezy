package com.apps.formezy.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebMainController {
	
	//to re-route to react.js router
	@RequestMapping(value = "/{path:[^\\.]*}")
    public String redirectSingle() {
		return "forward:/index.html";
	}

	@GetMapping("/*/{path:[^\\.]*}")
	public String redirectNested() {
		return "forward:/index.html";
	}
}
