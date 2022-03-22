import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService,private jwt:JwtService,private config:ConfigService){}
    hello() {
        return {'msg':'hi'}
    }
    async signup(dto:AuthDto) {
        const hash=await  argon.hash(dto.password);
        try {
            const user=await  this.prisma.user.create({
                data:{
                    email:dto.email,
                    hash:hash
                }
            });
            delete user.hash;
            return user
        } catch (error) {
            if (error  instanceof PrismaClientKnownRequestError){
                if (error.code==='P2002'){
                    throw new ForbiddenException("Credentials  taken");
                    
                }
            }

        }


    }
    async signin(dto:AuthDto) {
        const user=await  this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        })
       
        if(!user){
            throw new ForbiddenException("user does not exist");
            
        }
        const verify=argon.verify(user.hash,dto.password)
        
        if(!verify){
            throw new ForbiddenException("Wrong Credentials ");
            
        }else{
            return this.signToken(user.id,user.email)
        }
        
    }
    async  signToken (userId: number, email: string): Promise<{access_token:string} > {
        const payload = {
        sub: userId,
        email,
        };
        const secret = this.config.get('JWT_SECRET' )
        const token=await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
            })

        return {
            access_token : token,
            };
    }
}