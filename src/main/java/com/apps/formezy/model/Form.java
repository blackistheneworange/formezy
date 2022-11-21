package com.apps.formezy.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="Forms")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Form {
	
	//default constructor
	public Form(String id, String name, String desc, String type, boolean active, String companyName) {
		this.id = id;
		this.name = name;
		this.desc=desc;
		this.type=type;
		this.active=active;
		this.companyName=companyName;
	}
	@Id
	private String id;
	@Indexed(unique = true)
	@NotNull(message = "Form name cannot be empty")
	private String name;
	@NotNull(message = "Form description cannot be empty")
	private String desc;
	private String type="normal";
	private boolean active=true;
	private String companyName;
	//contains ids for FormFields collection
	private List<String> fields = new ArrayList<String>();
	private LocalDateTime created;
	private LocalDateTime updated;
	

}
